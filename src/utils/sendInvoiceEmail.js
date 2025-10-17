const nodemailer = require("nodemailer");
const path = require("path");

const sendInvoiceEmail = async ({ to, subject, text, attachmentPath }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SMTP config for production
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // use app password, not your real password
    },
  });

  const mailOptions = {
    from: `"Shrtly Billing" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "invoice.pdf",
        path: attachmentPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendInvoiceEmail;
