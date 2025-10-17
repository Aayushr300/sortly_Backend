const getDb = require("../config/db");
const bcrypt = require("bcrypt");
// controllers/user.controller.js
exports.getUserProfile = async (req, res) => {
  try {
    const db = await getDb();
    // or however you access your MySQL

    const [rows] = await db.execute(
      "SELECT id, name, email, avatar FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getRecentLinksByUser = async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const [rows] = await db.execute(
      `SELECT id,short_url, full_url, click, created_at 
       FROM short_urls 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching recent links:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllLinksByUser = async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const [rows] = await db.execute(
      `SELECT short_url, full_url, click, created_at 
       FROM short_urls 
       WHERE user_id = ? 
       `,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching recent links:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//   try {
//     const db = await getDb();
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const [[stats]] = await db.execute(
//       `SELECT
//          COUNT(*) AS total_links,
//          SUM(click) AS total_clicks,
//          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active_links
//        FROM short_urls
//        WHERE user_id = ?`,
//       [userId]
//     );

//     const [countryStats] = await db.execute(
//       `SELECT
//          country,
//          COUNT(*) AS click_count
//        FROM clicks
//        WHERE user_id = ? AND country IS NOT NULL
//        GROUP BY country
//        ORDER BY click_count DESC
//        LIMIT 5`, // Get top 5 countries
//       [userId]
//     );

//     // Ensure null values are replaced with 0
//     res.status(200).json({
//       total_links: stats.total_links ?? 0,
//       total_clicks: stats.total_clicks ?? 0,
//       active_links: stats.active_links ?? 0,
//       top_countries: countryStats.length > 0 ? countryStats : [],
//     });
//   } catch (err) {
//     console.error("Error fetching link stats:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

exports.getUserLinkStats = async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Date calculations
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get basic stats
    const [[stats]] = await db.execute(
      `SELECT 
         COUNT(*) AS total_links,
         SUM(click) AS total_clicks,
         SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active_links
       FROM short_urls
       WHERE user_id = ?`,
      [userId]
    );

    // Get current month clicks (from clicks table for accuracy)
    const [[currentMonthClicks]] = await db.execute(
      `SELECT COUNT(*) AS click_count 
       FROM clicks 
       WHERE user_id = ? 
       AND clicked_at >= ?`,
      [userId, currentMonthStart]
    );

    // Get last month's clicks (from clicks table)
    const [[lastMonthStats]] = await db.execute(
      `SELECT COUNT(*) AS last_month_clicks
       FROM clicks
       WHERE user_id = ? 
       AND clicked_at BETWEEN ? AND ?`,
      [userId, lastMonthStart, lastMonthEnd]
    );

    // Get country stats (include localhost)
    const [countryStats] = await db.execute(
      `SELECT 
         CASE 
           WHEN country = 'localhost' THEN 'Local'
           WHEN country IS NULL THEN 'Unknown'
           ELSE country 
         END AS country,
         COUNT(*) AS click_count
       FROM clicks
       WHERE user_id = ?
       GROUP BY country
       ORDER BY click_count DESC
       LIMIT 5`,
      [userId]
    );

    res.status(200).json({
      total_links: stats.total_links ?? 0,
      total_clicks: currentMonthClicks.click_count ?? 0, // Using clicks table count
      active_links: stats.active_links ?? 0,
      last_month_clicks: lastMonthStats.last_month_clicks ?? 0,
      top_countries: countryStats.filter((c) => c.country !== "Unknown"), // Optional: filter out Unknown
    });
  } catch (err) {
    console.error("Error fetching link stats:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getTopLinks = async (req, res) => {
  try {
    const db = await getDb();

    const userId = req.user?.id || null;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [rows] = await db.execute(
      "SELECT short_url, full_url, click, created_at FROM short_urls WHERE user_id = ? ORDER BY click DESC LIMIT 5",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching top links:", err);
    res.status(500).json({ error: "Failed to fetch top links" });
  }
};

exports.getUserAllLinks = async (req, res) => {
  try {
    const db = await getDb();

    const userId = req.user?.id || null;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [rows] = await db.execute(
      "SELECT id , short_url, full_url, click, created_at FROM short_urls WHERE user_id = ?",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching top links:", err);
    res.status(500).json({ error: "Failed to fetch top links" });
  }
};

exports.getUserSettings = async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const [[user]] = await db.execute(
      "SELECT name, email FROM users WHERE id = ?",
      [userId]
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.userProfileUpdate = async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Optional: Check if new email already exists (if updating email)
    const [[existingUser]] = await db.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    await db.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      userId,
    ]);

    res
      .status(200)
      .json({ message: "Profile updated successfully", name, email });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  const db = await getDb();
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const [[user]] = await db.execute(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );

    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Password update failed:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getClicksPerDay = async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user?.id;

    const [rows] = await db.execute(
      `SELECT 
         DATE(clicked_at) AS date, 
         COUNT(*) AS clicks 
       FROM clicks 
       WHERE user_id = ? 
       GROUP BY DATE(clicked_at) 
       ORDER BY date`,
      [userId]
    );

    res.json(rows); // ← returns [{ date: '2025-06-01', clicks: 50 }, ...]
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getClicksDetails = async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user?.id;

    // Adjust this query as needed.
    // If you want only clicks for this user:
    let query = `
      SELECT c.ip, c.browser, c.os, c.clicked_at, s.short_url
      FROM clicks c
      JOIN short_urls s ON s.id = c.link_id
    `;
    const params = [];
    if (userId) {
      query += " WHERE s.user_id = ?";
      params.push(userId);
    }
    query += " ORDER BY c.clicked_at DESC LIMIT 5"; // Adjust limit as needed

    const [rows] = await db.execute(query, params);

    res.json(rows);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserTopReferrers = async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user?.id;

    // Group clicks by referrer_category
    let query = `
      SELECT c.referrer_category AS source, COUNT(*) AS visits
      FROM clicks c
      JOIN short_urls s ON s.id = c.link_id
    `;
    const params = [];
    if (userId) {
      query += " WHERE s.user_id = ?";
      params.push(userId);
    }
    query += " GROUP BY c.referrer_category";
    const [rows] = await db.execute(query, params);

    // Calculate total visits
    const totalVisits = rows.reduce((sum, row) => sum + row.visits, 0);

    // Append percentage
    const referrers = rows.map((row) => {
      const percentage = totalVisits
        ? Math.round((row.visits / totalVisits) * 100)
        : 0;

      return {
        source: row.source || "Direct",
        visits: row.visits,
        percentage,
      };
    });

    res.json(referrers);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDeleteLinks = async (req, res) => {
  const id = req.params.id;
  const userId = req.user?.id;

  try {
    const conn = getDb();
    await conn.query("DELETE FROM clicks WHERE link_id = ?", [id]);

    // Then delete the short URL
    await conn.query("DELETE FROM short_urls WHERE id = ?", [id]);

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting short link:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSingleLinkStats = async (req, res) => {
  const linkId = req.params.id;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const db = await getDb();

    // Validate ownership
    const [[link]] = await db.execute(
      "SELECT * FROM short_urls WHERE id = ? AND user_id = ?",
      [linkId, userId]
    );

    if (!link) return res.status(404).json({ message: "Link not found" });

    // Total Clicks for this link
    const [[{ total_clicks }]] = await db.execute(
      `SELECT COUNT(*) AS total_clicks FROM clicks WHERE link_id = ?`,
      [linkId]
    );

    // Clicks by country
    const [countryStats] = await db.execute(
      `SELECT 
         CASE 
           WHEN country = 'localhost' THEN 'Local'
           WHEN country IS NULL THEN 'Unknown'
           ELSE country 
         END AS country,
         COUNT(*) AS click_count
       FROM clicks
       WHERE link_id = ?
       GROUP BY country
       ORDER BY click_count DESC
       LIMIT 5`,
      [linkId]
    );

    // Clicks by referrer
    const [referrerStats] = await db.execute(
      `SELECT 
         CASE
           WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
           ELSE referrer
         END AS source,
         COUNT(*) AS visits
       FROM clicks
       WHERE link_id = ?
       GROUP BY source
       ORDER BY visits DESC
       LIMIT 5`,
      [linkId]
    );

    // Clicks per day for chart
    const [dailyClicks] = await db.execute(
      `SELECT 
         DATE(clicked_at) AS date,
         COUNT(*) AS clicks
       FROM clicks
       WHERE link_id = ?
       GROUP BY DATE(clicked_at)
       ORDER BY date ASC`,
      [linkId]
    );

    res.status(200).json({
      link_id: linkId,
      full_url: link.full_url,
      short_url: link.short_url,
      total_clicks,
      top_countries: countryStats,
      top_referrers: referrerStats.map((r) => ({
        ...r,
        percentage: ((r.visits / total_clicks) * 100).toFixed(2),
      })),
      dailyClicks,
    });
  } catch (err) {
    console.error("Error fetching link stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};
