const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// const generateInvoicePdf = (invoice, outputPath) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ margin: 50 });
//     const stream = fs.createWriteStream(outputPath);
//     doc.pipe(stream);

//     // Header
//     doc
//       .fontSize(20)
//       .fillColor("#4f46e5")
//       .text("Your Company Name", { align: "left" });
//     doc
//       .fontSize(10)
//       .fillColor("black")
//       .text(
//         "123 Business Street\nCity, State 10001\nPhone: (123) 456-7890\nEmail: billing@Shrtly.com",
//         {
//           align: "left",
//         }
//       );

//     doc
//       .fontSize(18)
//       .fillColor("#4f46e5")
//       .text("INVOICE", { align: "right" })
//       .moveDown();
//     doc
//       .fontSize(10)
//       .fillColor("black")
//       .text(`Invoice Number: ${invoice.id}`, { align: "right" })
//       .text(`Date: ${new Date(invoice.created_at).toLocaleString()}`, {
//         align: "right",
//       });

//     doc.moveDown();

//     // Billing Info
//     doc.fontSize(12).text("Bill To:");
//     doc.fontSize(10).text(invoice.email).moveDown();

//     // Invoice table
//     doc.moveDown().fontSize(12).text("Invoice Details");
//     doc.moveDown().fontSize(10);
//     doc.text("Description", { continued: true, width: 200 });
//     doc.text("Order ID", { continued: true, align: "center", width: 150 });
//     doc.text("Amount", { align: "right" });

//     doc.moveDown();
//     doc.text(invoice.description, { continued: true, width: 200 });
//     doc.text(invoice.order_id, {
//       continued: true,
//       align: "center",
//       width: 150,
//     });
//     doc.text(`INR ${parseFloat(invoice.amount).toFixed(2)}`, {
//       align: "right",
//     });

//     // Total
//     doc.moveDown().fontSize(12).text("TOTAL PAID:");
//     doc.fontSize(10).text(`INR ${parseFloat(invoice.amount).toFixed(2)}`, {
//       align: "left",
//     });

//     // Footer
//     doc
//       .moveDown()
//       .fontSize(10)
//       .fillColor("#6b7280")
//       .text("Thank you for your business!", { align: "center" })
//       .text("Your Company Name • www.yourcompany.com", { align: "center" });

//     doc.end();

//     stream.on("finish", resolve);
//     stream.on("error", reject);
//   });
// };

const generateInvoicePdf = (invoice, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const purple = "#4f46e5";
    const gray = "#6b7280";

    // Header
    doc
      .fillColor(purple)
      .fontSize(20)
      .text("Your Company Name", 50, 50, { align: "left" });

    doc
      .fillColor("black")
      .fontSize(10)
      .text("123 Business Street", 50, 75)
      .text("City, State 10001")
      .text("Phone: (123) 456-7890")
      .text("Email: billing@Shrtly.com");

    doc
      .fillColor(purple)
      .fontSize(20)
      .text("INVOICE", 400, 50, { align: "right" });

    doc
      .fontSize(8)
      .fillColor("gray")
      .text("INVOICE NUMBER", 400, 75, { align: "right" })
      .fillColor("black")
      .text(invoice.id.toString(), 400, 85, { align: "right" })
      .fillColor("gray")
      .text(
        new Date(invoice.created_at).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        400,
        100,
        { align: "right" }
      );

    // Line below header
    doc.moveTo(50, 125).lineTo(550, 125).strokeColor(purple).stroke();

    // Billing Info
    doc
      .fontSize(12)
      .fillColor("black")
      .text("Bill To", 50, 150)
      .fontSize(10)
      .text(invoice.email);

    // Section: Invoice Details
    doc.fontSize(12).fillColor("black").text("Invoice Details", 50, 200);

    // Table Header
    const tableTop = 220;
    const descX = 50;
    const orderX = 250;
    const amountX = 400;

    doc.fillColor("#f3f4f6").rect(descX, tableTop, 500, 20).fill();

    doc
      .fillColor("black")
      .fontSize(10)
      .text("Description", descX + 5, tableTop + 5)
      .text("Order ID", orderX, tableTop + 5)
      .text("Amount", amountX + 100, tableTop + 5, { align: "right" });

    // Table row
    const rowTop = tableTop + 25;
    doc
      .fillColor("black")
      .fontSize(10)
      .text(invoice.description, descX + 5, rowTop)
      .text(invoice.order_id, orderX, rowTop)
      .text(
        `INR ${parseFloat(invoice.amount).toFixed(2)}`,
        amountX + 100,
        rowTop,
        { align: "right" }
      );

    // Total Paid
    doc
      .fontSize(10)
      .fillColor("black")
      .rect(amountX, rowTop + 40, 150, 25)
      .stroke()
      .font("Helvetica-Bold")
      .text("TOTAL PAID", amountX + 10, rowTop + 47)
      .font("Helvetica")
      .text(
        `INR ${parseFloat(invoice.amount).toFixed(2)}`,
        amountX + 90,
        rowTop + 47,
        { align: "right" }
      );

    // Footer
    doc
      .fontSize(10)
      .fillColor(gray)
      .text("Thank you for your business!", 0, 700, { align: "center" })
      .text("Your Company Name • www.yourcompany.com", 0, 715, {
        align: "center",
      });

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};

module.exports = generateInvoicePdf;
