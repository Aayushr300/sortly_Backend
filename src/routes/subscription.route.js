const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const getDb = require("../config/db");
const crypto = require("crypto");
const verifyToken = require("../middleware/auth");
const fs = require("fs"); // ✅ Required for working with files
const path = require("path"); // ✅ Required for path.join
const generateInvoicePdf = require("../utils/generateInvoicePdf");
const sendInvoiceEmail = require("../utils/sendInvoiceEmail");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-payment", async (req, res) => {
  const { amount, email, name } = req.body;

  const options = {
    amount: amount * 100, // Amount in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      name,
      email,
    },
  };

  try {
    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name,
      email,
    });
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

router.post("/verify-payment", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    amount,
    description,
  } = req.body;

  const userId = req.user?.id;

  if (
    !userId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !amount
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // Verify signature
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }

  try {
    const db = await getDb();

    const [plans] = await db.query(
      "SELECT id, name, price, duration_months FROM subscription_plans WHERE id = ? AND is_active = 1",
      [plan]
    );

    if (plans.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or inactive plan" });
    }

    const selectedPlan = plans[0];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + selectedPlan.duration_months);

    await db.query(
      `INSERT INTO subscriptions (user_id, plan, plan_id, price, is_active, start_date, end_date)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
      [
        userId,
        selectedPlan.name, // plan name as string
        selectedPlan.id, // foreign key
        selectedPlan.price, // snapshot of price
        startDate,
        endDate,
      ]
    );

    await db.query(`UPDATE users SET subscription_active  = 1 WHERE id = ?`, [
      userId,
    ]);

    // Insert into invoices table
    const [invoiceResult] = await db.query(
      `INSERT INTO invoices (user_id, amount, order_id, payment_id, description)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        amount,
        razorpay_order_id,
        razorpay_payment_id,
        description || "Subscription payment",
      ]
    );

    const invoiceId = invoiceResult.insertId;

    // Sending email to the user

    // 👤 Get user email
    const [[userRow]] = await db.query(
      `SELECT email FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    // 🧾 Prepare invoice data
    const invoiceData = {
      id: invoiceId,
      email: userRow.email,
      amount,
      description: description || selectedPlan.name + " Subscription",
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      created_at: new Date(),
    };

    // ✅ Ensure invoice folder exists
    const invoiceDir = path.join(__dirname, "../../invoices");
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir);
    }

    // 📄 Generate PDF
    // 📄 Generate invoice PDF
    const pdfPath = path.join(invoiceDir, `invoice_${invoiceId}.pdf`);

    await generateInvoicePdf(invoiceData, pdfPath);

    // 📧 Email PDF
    await sendInvoiceEmail({
      to: userRow.email,
      subject: "Your Subscription Invoice",
      text: `Thank you for subscribing to ${selectedPlan.name}. Amount paid: ₹${amount}`,
      attachmentPath: pdfPath,
    });

    return res.json({
      success: true,
      message: "Payment verified and invoice saved",
      invoice_id: invoiceId,
    });
  } catch (err) {
    console.error("❌ Error verifying payment or inserting invoice:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/check-subscription", async (req, res) => {
  const userId = req.user.id;

  try {
    const db = await getDb();

    const [rows] = await db.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? AND is_active = 1 
       AND start_date <= CURRENT_DATE() 
       AND end_date >= CURRENT_DATE() 
       ORDER BY end_date DESC 
       LIMIT 1`,
      [userId]
    );

    if (rows.length > 0) {
      return res.json({ active: true });
    } else {
      return res.json({ active: false });
    }
  } catch (err) {
    console.error("Subscription check error:", err);
    res.status(500).json({ active: false, error: "Server error" });
  }
});

router.get("/get-subscription", async (req, res) => {
  try {
    const userId = req.user.id; // Make sure `req.user` is set by auth middleware

    const conn = await getDb();
    const [rows] = await conn.execute(
      "SELECT subscription_active FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscriptionActive = rows[0].subscription_active === 1;

    return res.status(200).json({ subscriptionActive });
  } catch (err) {
    console.error("Error fetching subscription:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/payment-status", async (req, res) => {
  const { payment_id } = req.query;
  if (!payment_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing payment ID" });
  }

  try {
    const db = await getDb();
    const [rows] = await db.query(
      "SELECT id FROM invoices WHERE payment_id = ?",
      [payment_id]
    );

    if (rows.length > 0) {
      return res.json({
        success: true,
        processed: true,
        invoiceId: rows[0].id,
      });
    }

    return res.json({ success: true, processed: false });
  } catch (err) {
    console.error("❌ Error checking payment status:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
