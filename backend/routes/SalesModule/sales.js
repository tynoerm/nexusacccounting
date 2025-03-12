import mongoose from "mongoose";
import express from "express";
import PDFDocument  from "pdfkit";
import ExcelJS from "exceljs";

import salesSchema from "../../models/SalesModule/sales.js"

let router = express.Router();

//create a sale
router.route("/create-sale").post(async (req, res, next) => {
    await salesSchema
        .create(req.body)
        .then((result) => {
            res.json({
                data: result,
                message: "record created successfully",
                status: 200,
            });
        })
        .catch((err) => {
            console.log(err); // FIX: Change `console.log(data.err)` to `console.log(err)`
            return next(err);
        });
});

//get all sales from the database (REPORTS)
router.route("/").get(async (req, res, next) => {
    await salesSchema
    .find()
    .then((result) => {
        res.json({
            data: result,
            message: "sales fetched successfully",
            status: 200,
        })
    })
    .catch((err) => {
        return next(err);
    });
});

 
 // PDF Export Route
 router.get("/download/pdf", async (req, res) => {
  try {
    const files = await salesSchema.find();

    // Create PDF (A4 size: 595 x 842)
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Disposition", 'attachment; filename="sales_report.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Title
    doc.fontSize(18).font("Helvetica-Bold").text("Sales Report", { align: "center", underline: true });
    doc.moveDown(2);

    // Column Headers
    const startX = 40;
    let y = doc.y;
    const colWidths = [30, 70, 80, 100, 80, 60, 50, 50, 50, 50, 60];

    doc.fontSize(10).font("Helvetica-Bold");
    const headers = [
      "No.", "Date", "Cashier", "Customer", "Item", "Payment", "Currency", "Qty", "Unit Price", "VAT", "Total Price"
    ];
    
    headers.forEach((header, i) => {
      doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, { width: colWidths[i] });
    });

    // Header Separator
    doc.moveDown(0.5);
    doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown();

    // Data Rows
    doc.fontSize(9).font("Helvetica");
    let rowHeight = 15;
    let maxRowsPerPage = 40;

    files.forEach((file, index) => {
      if (index > 0 && index % maxRowsPerPage === 0) {
        doc.addPage(); // New page if exceeded max rows
        y = doc.y; // Reset Y position

        // Re-add headers
        doc.fontSize(10).font("Helvetica-Bold");
        headers.forEach((header, i) => {
          doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, { width: colWidths[i] });
        });

        doc.moveDown(0.5);
        doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown();
      }

      y = doc.y;
      const formattedDate = file.date ? file.date.toISOString().split("T")[0] : "N/A";

      const rowValues = [
        index + 1, formattedDate, file.cashierName || "N/A", file.customerName || "N/A",
        file.itemDescription || "N/A", file.paymentMethod || "N/A", file.currency || "N/A",
        file.quantity ? file.quantity.toFixed(2) : "0.00",
        file.unitPrice ? file.unitPrice.toFixed(2) : "0.00",
        file.vat ? file.vat.toFixed(2) : "0.00",
        file.totalPrice ? file.totalPrice.toFixed(2) : "0.00"
      ];

      rowValues.forEach((value, i) => {
        doc.text(value, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, { width: colWidths[i] });
      });

      doc.moveDown(0.5);
      doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});

// Excel Export Route
router.get("/download/excel", async (req, res) => {
  try {
    const files = await salesSchema.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    // Define Columns
    worksheet.columns = [
      { header: "No.", key: "no", width: 5 },
      { header: "Date", key: "date", width: 15 },
      { header: "Cashier Name", key: "cashierName", width: 20 },
      { header: "Customer Name", key: "customerName", width: 20 },
      { header: "Item Description", key: "itemDescription", width: 30 },
      { header: "Payment Method", key: "paymentMethod", width: 20 },
      { header: "Currency", key: "currency", width: 10 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Unit Price", key: "unitPrice", width: 15 },
      { header: "VAT", key: "vat", width: 15 },
      { header: "Total Price", key: "totalPrice", width: 20 },
    ];

    // Add Data Rows
    files.forEach((file, index) => {
      worksheet.addRow({
        no: index + 1,
        date: file.date ? file.date.toISOString().split("T")[0] : "N/A",
        cashierName: file.cashierName || "N/A",
        customerName: file.customerName || "N/A",
        itemDescription: file.itemDescription || "N/A",
        paymentMethod: file.paymentMethod || "N/A",
        currency: file.currency || "N/A",
        quantity: !isNaN(file.quantity) ? Number(file.quantity).toFixed(2) : "0.00",
        unitPrice: !isNaN(file.unitPrice) ? Number(file.unitPrice).toFixed(2) : "0.00",
        vat: !isNaN(file.vat) ? Number(file.vat).toFixed(2) : "0.00",
        totalPrice: !isNaN(file.totalPrice) ? Number(file.totalPrice).toFixed(2) : "0.00",
      });
    });

    // Style Header Row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    res.setHeader("Content-Disposition", 'attachment; filename="sales_report.xlsx"');
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating Excel file");
  }
});


export { router as salesRoutes}