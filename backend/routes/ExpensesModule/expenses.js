import mongoose from "mongoose";
import express from "express";
import PDFDocument  from "pdfkit";
import ExcelJS from "exceljs";

import expensesSchema from "../../models/ExpensesModule/expenses.js"

let router = express.Router();

//create an expense (petty cash)
router.route("/create-expense").post(async (req, res, next) => {
    await expensesSchema 
     .create(req.body)
     .then((result) => {
        res.json({
            data: result,
            message: "pettycash created successfully",
            status: 200,
        });
     })
     .catch((err) => {
        return next(err); 
     });
});

router.route("/").get(async (req,res,next) => {
  await expensesSchema
  .find()
  .then((result) => {
    res.json({
      data: result,
      message: "expenses fetched successfully",
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
    const files = await expensesSchema.find();

    // Create PDF (A4 size: 595 x 842)
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Disposition", 'attachment; filename="expenses_report.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res); // Send PDF to response

    // Title
    doc.fontSize(18).font("Helvetica-Bold").text("Expense Report", { align: "center", underline: true });
    doc.moveDown(2);

    // Column Headers
    const startX = 40;
    let y = doc.y;
    const colWidths = [30, 70, 80, 100, 80, 80, 60, 80]; // Adjusted widths to fit A4 page

    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("No.", startX, y, { width: colWidths[0] });
    doc.text("Date", startX + colWidths[0], y, { width: colWidths[1] });
    doc.text("Issued To", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
    doc.text("Description", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
    doc.text("Payment", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
    doc.text("Expense", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
    doc.text("Amount", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });
    doc.text("Authorized", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y, { width: colWidths[7] });

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
        doc.text("Issued To", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
        doc.text("Description", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
        doc.text("Payment", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
        doc.text("Expense", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
        doc.text("Amount", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });
        doc.text("Authorized", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y, { width: colWidths[7] });

        doc.moveDown(0.5);
        doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown();
      }

      y = doc.y;
      const formattedDate = file.date ? file.date.toISOString().split("T")[0] : "N/A";

      doc.fontSize(9).font("Helvetica");
      doc.text(`${index + 1}`, startX, y, { width: colWidths[0] });
      doc.text(formattedDate, startX + colWidths[0], y, { width: colWidths[1] });
      doc.text(file.issuedTo || "N/A", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
      doc.text(file.description || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
      doc.text(file.paymentMethod || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
      doc.text(file.expenseType || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
      doc.text(file.amount ? file.amount.toFixed(2) : "0.00", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });
      doc.text(file.authorisedBy || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y, { width: colWidths[7] });

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
     const files = await expensesSchema.find();
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet("Expense Report");

     // Add Header Row
     worksheet.columns = [
       { header: "No.", key: "no", width: 5 },
       { header: "Date", key: "date", width: 15 },
       { header: "Issued To", key: "issuedTo", width: 20 },
       { header: "Description", key: "description", width: 30 },
       { header: "Payment Method", key: "paymentMethod", width: 20 },
       { header: "Expense Type", key: "expenseType", width: 20 },
       { header: "Amount", key: "amount", width: 15 },
       { header: "Authorized By", key: "authorisedBy", width: 20 },
     ];

     // Add Data Rows
     files.forEach((file, index) => {
       worksheet.addRow({
         no: index + 1,
         date: file.date ? file.date.toISOString().split("T")[0] : "N/A",
         issuedTo: file.issuedTo || "N/A",
         description: file.description || "N/A",
         paymentMethod: file.paymentMethod || "N/A",
         expenseType: file.expenseType || "N/A",
         amount: file.amount ? file.amount.toFixed(2) : "0.00",
         authorisedBy: file.authorisedBy || "N/A",
       });
     });

     // Style the Header Row
     worksheet.getRow(1).font = { bold: true };
     worksheet.getRow(1).alignment = { horizontal: "center" };

     res.setHeader("Content-Disposition", 'attachment; filename="output.xlsx"');
     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
     workbook.xlsx.write(res).then(() => res.end());
   } catch (error) {
     console.error(error);
     res.status(500).send("Error generating Excel file");
   }
});


export {router as expensesRoutes}