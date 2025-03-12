import mongoose from "mongoose";
import express from "express";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";


import stocksSchema from "../../models/StockModule/stocks.js"


let router = express.Router();

//create a stock 

router.route("/create-stock").post(async (req, res, next) => {
  await stocksSchema
    .create(req.body)
    .then((result) => {
      res.json({
        data: result,
        message: "stocks created successfully",
        status: 200,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

//get stocks created (REPORTS MAPPING BY DATE)

router.route("/").get(async (req, res, next) => {
  await stocksSchema
    .find()
    .then((result) => {
      res.json({
        data: result,
        message: "stocks mapped successfully done",
        status: 200,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

// PDF Export Route
router.get("/download/pdf", async (req, res) => {
  try {
    const files = await stocksSchema.find();

    // Create PDF (A4 size: 595 x 842)
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Disposition", 'attachment; filename="quotation_report.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res); // Send PDF to response

    // Title
    doc.fontSize(18).font("Helvetica-Bold").text("Stock Batches", { align: "center", underline: true });
    doc.moveDown(2);

    // Column Headers
    const startX = 40;
    let y = doc.y;
    const colWidths = [30, 70, 80, 100, 80, 80, 60, 80]; // Adjusted widths to fit A4 page

    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("No.", startX, y, { width: colWidths[0] });
    doc.text("Date", startX + colWidths[0], y, { width: colWidths[1] });
    doc.text("Supplier Name", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
    doc.text("Stock Descrip", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
    doc.text("Stock Quantity", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
    doc.text("Status", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });

    doc.text("Total Price", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });

    // Draw Header Separator
    doc.moveDown(0.5);
    doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown();

    // Data Rows
    doc.fontSize(9).font("Helvetica");
    let rowHeight = 15;
    let maxRowsPerPage = 40; // Ensuring content fits A4 page

    files.forEach((file, index) => {
      if (index > 0 && index % maxRowsPerPage === 0) {
        doc.addPage(); // Add new page after maxRowsPerPage
        y = doc.y; // Reset Y position

        // Re-add headers on new page
        doc.fontSize(10).font("Helvetica-Bold");
        doc.text("No.", startX, y, { width: colWidths[0] });
        doc.text("Date", startX + colWidths[0], y, { width: colWidths[1] });
        doc.text("Quote #", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
        doc.text("Customer Name", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
        doc.text("Transport Cost", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
        doc.text("Buying Price", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
        doc.text("Selling Price", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });
        doc.text("ReceivedBy", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y, { width: colWidths[7] });

        doc.moveDown(0.5);
        doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown();
      }

      y = doc.y;
      const formattedDate = file.date ? file.date.toISOString().split("T")[0] : "N/A";

      doc.fontSize(9).font("Helvetica");
      doc.text(`${index + 1}`, startX, y, { width: colWidths[0] });
      doc.text(formattedDate, startX + colWidths[0], y, { width: colWidths[1] });
      doc.text(file.supplierName || "N/A", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
      doc.text(file.stockDescription || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
      doc.text(file.stockQuantity || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
      doc.text(file.transportCost || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
      doc.text(file.buyingPrice || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });
      doc.text(file.sellingPrice || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y, { width: colWidths[7] });
      doc.text(file.receivedBy || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6] + colWidths[7], y, { width: colWidths[8] });

      doc.moveDown(0.5);
      doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown();
    });

    doc.end(); // Close the document
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});

// Excel Export Route
router.get("/download/excel", async (req, res) => {
  try {
    const files = await stocksSchema.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expense Report");

    // Add Header Row
    worksheet.columns = [
      { header: "No.", key: "no", width: 5 },
      { header: "Date", key: "date", width: 15 },
      { header: "Supplier Name", key: "supplierName", width: 15 },
      { header: "Stock Description", key: "stockDescription", width: 20 },
      { header: "Stock Quantity", key: "stockQuantity", width: 15 },
      { header: "Transport Cost", key: "transportCost", width: 15 },
      { header: "Buying Price", key: "buyingPrice", width: 15 },
      { header: "Selling Price", key: "sellingPrice", width: 15 },
      { header: "Received By", key: "receivedBy", width: 20 },
    ];

    // Add Data Rows
    files.forEach((file, index) => {
      worksheet.addRow({
        no: index + 1,
        date: file.date ? file.date.toISOString().split("T")[0] : "N/A",
        supplierName: file.supplierName || "N/A",
        stockDescription: file.stockDescription || "N/A",
        stockQuantity: !isNaN(file.stockQuantity) ? Number(file.stockQuantity).toFixed(2) : "0.00",
        transportCost: !isNaN(file.transportCost) ? Number(file.transportCost).toFixed(2) : "0.00",
        buyingPrice: !isNaN(file.buyingPrice) ? Number(file.buyingPrice).toFixed(2) : "0.00",
        sellingPrice: !isNaN(file.sellingPrice) ? Number(file.sellingPrice).toFixed(2) : "0.00",
        receivedBy: file.receivedBy || "N/A",
      });
    });

    // Style the Header Row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    res.setHeader("Content-Disposition", 'attachment; filename="output.xlsx"');
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating Excel file");
  }
});






export { router as stocksRoutes }