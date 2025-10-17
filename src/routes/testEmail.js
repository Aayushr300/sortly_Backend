// routes/testEmail.js
const express = require("express");
const sendInvoiceEmail = require("../utils/sendInvoiceEmail");
const path = require("path");
const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    await sendInvoiceEmail({
      to: "offers.hubs@gmail.com", // use different account
      subject: "Test Invoice Email",
      text: "This is a test email with invoice.",
    });

    res.json({ success: true, message: "Test email sent" });
  } catch (err) {
    console.error("❌ Email test failed:", err);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

module.exports = router;
