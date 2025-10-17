const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getDb = require("../config/db");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "yoursecret";

// Admin Signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const db = await getDb();
  try {
    const [existing] = await db.execute(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO admins (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Admin registered" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = await getDb();
  try {
    const [rows] = await db.execute("SELECT * FROM admins WHERE email = ?", [
      email,
    ]);
    const admin = rows[0];
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin Stats
router.get("/stats", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const db = await getDb();
  try {
    if (!token) return res.status(401).json({ message: "Missing token" });

    jwt.verify(token, JWT_SECRET);

    const [[{ totalUsers }]] = await db.execute(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );
    const [[{ activeSubscribers }]] = await db.execute(
      "SELECT COUNT(*) AS activeSubscribers FROM subscriptions WHERE is_active = 1"
    );

    res.json({ totalUsers, activeSubscribers });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
});

// router.get("/users", async (req, res) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.split(" ")[1];
//   const db = await getDb();
//   try {
//     if (!token) return res.status(401).json({ message: "Missing token" });

//     jwt.verify(token, JWT_SECRET);

//     const [[{ totalUsers }]] = await db.execute(
//       "SELECT COUNT(*) AS totalUsers FROM users"
//     );
//     const [[{ activeSubscribers }]] = await db.execute(
//       "SELECT COUNT(*) AS activeSubscribers FROM subscriptions WHERE is_active = 1"
//     );

//     // const [users] = await db.execute("SELECT id, name, email FROM users");

//     const [users] = await db.execute(`
//   SELECT
//     u.id,
//     u.name,
//     u.email,
//     u.created_at,
//     COUNT(l.id) AS totalLinks
//   FROM users u
//   LEFT JOIN short_urls l ON l.user_id = u.id
//   GROUP BY u.id
// `);

//     res.json({ totalUsers, activeSubscribers, users });
//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized", error: err.message });
//   }
// });

router.get("/users", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const db = await getDb();

  try {
    if (!token) return res.status(401).json({ message: "Missing token" });

    jwt.verify(token, JWT_SECRET);

    const [[{ totalUsers }]] = await db.execute(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[{ activeSubscribers }]] = await db.execute(
      "SELECT COUNT(*) AS activeSubscribers FROM subscriptions WHERE is_active = 1"
    );

    const [users] = await db.execute(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.created_at,
        COUNT(l.id) AS totalLinks
      FROM users u
      LEFT JOIN short_urls l ON l.user_id = u.id
      GROUP BY u.id
    `);

    const [subscriptions] = await db.execute(`
      SELECT * FROM subscriptions
    `);

    // Merge subscriptions into users
    const mergedUsers = users.map((user) => {
      const userSubscriptions = subscriptions.filter(
        (sub) => sub.user_id === user.id
      );
      return {
        ...user,
        subscriptions: userSubscriptions,
      };
    });

    res.json({ totalUsers, activeSubscribers, users: mergedUsers });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const conn = await getDb();
    const [result] = await conn.execute("DELETE FROM users WHERE id = ?", [
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/pages/:page", async (req, res) => {
  const page_key = req.params.page;
  const { title, content } = req.body;

  try {
    const db = await getDb();
    const [existing] = await db.execute(
      "SELECT id FROM static_pages WHERE page_key = ?",
      [page_key]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Page not found" });
    }

    await db.execute(
      "UPDATE static_pages SET title = ?, content = ? WHERE page_key = ?",
      [title, content, page_key]
    );

    res.json({ message: "Page updated successfully." });
  } catch (err) {
    console.error("Error updating page:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/pages/:page", async (req, res) => {
  const page_key = req.params.page; // e.g. "privacy", "terms", "refund"
  const { title, content } = req.body;

  try {
    const db = await getDb();
    // Check if page already exists
    const [existing] = await db.execute(
      "SELECT id FROM static_pages WHERE page_key = ?",
      [page_key]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Page already exists. Use PUT to update." });
    }

    await db.execute(
      "INSERT INTO static_pages (page_key, title, content) VALUES (?, ?, ?)",
      [page_key, title, content]
    );

    res.status(201).json({ message: "Page created successfully." });
  } catch (err) {
    console.error("Error saving page:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/invoices", async (req, res) => {
  try {
    const db = await getDb();

    const [invoices] = await db.query(`
  SELECT 
    invoices.*, 
    users.email 
  FROM 
    invoices 
  JOIN 
    users ON invoices.user_id = users.id
`);

    res.json(invoices);
  } catch (err) {
    console.error("Failed to fetch invoices:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
