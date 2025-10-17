const express = require("express");
const router = express.Router();
const getDb = require("../config/db");
// GET /users/invoices
router.get("/invoices", async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user.id;

    const [invoices] = await db.query(
      `SELECT 
     invoices.id, 
     invoices.amount, 
     invoices.order_id, 
     invoices.payment_id, 
     invoices.invoice_url, 
     invoices.description, 
     invoices.created_at,
     users.email
   FROM invoices
   JOIN users ON invoices.user_id = users.id
   WHERE invoices.user_id = ?
   ORDER BY invoices.created_at DESC`,
      [userId]
    );

    res.json(invoices);
  } catch (err) {
    console.error("Failed to fetch invoices:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
