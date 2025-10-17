const express = require("express");
const router = express.Router();
const getDb = require("../../config/db");

// GET all active subscription plans
router.get("/", async (req, res) => {
  try {
    const db = await getDb();

    const [rows] = await db.query(
      "SELECT * FROM subscription_plans WHERE is_active = 1 ORDER BY id ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE a new subscription plan
router.post("/", async (req, res) => {
  const db = await getDb();
  const { name, price, features, duration_months } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO subscription_plans (name, price, features, duration_months)
       VALUES (?, ?, ?, ?)`,
      [name, price, features || "", duration_months || 1]
    );

    res.status(201).json({ message: "Plan created", id: result.insertId });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ error: "Failed to create plan" });
  }
});

// UPDATE an existing plan
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, features, duration_months, is_active } = req.body;
  const db = await getDb();
  try {
    await db.query(
      `UPDATE subscription_plans
       SET name = ?, price = ?, features = ?, duration_months = ?, is_active = ?
       WHERE id = ?`,
      [name, price, features, duration_months, is_active ?? 1, id]
    );
    res.json({ message: "Plan updated" });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ error: "Failed to update plan" });
  }
});

router.delete("/:id", async (req, res) => {
  const db = await getDb();
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM subscription_plans WHERE id = ?",
      [id]
    );
    res.json({ message: "Plan deleted", result });
  } catch (err) {
    console.error("MySQL error:", err);
    res.status(500).json({ error: "Failed to delete plan" });
  }
});

module.exports = router;
