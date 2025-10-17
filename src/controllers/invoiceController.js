// controllers/invoiceController.js
exports.getUserInvoices = async (req, res) => {
  const userId = req.user.id; // from JWT middleware
  try {
    const [rows] = await db.execute(
      "SELECT id, invoice_number, amount, plan_name, download_url, created_at FROM invoices WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};
