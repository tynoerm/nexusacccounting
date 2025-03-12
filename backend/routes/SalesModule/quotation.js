import mongoose from "mongoose";
import express from "express";
import PDFDocument  from "pdfkit";
import ExcelJS from "exceljs";


import quotationSchema from "../../models/SalesModule/quotation.js"


let router = express.Router();

//create a quote
 router.route("/create-quote").post(async (req, res, next) => {
    await quotationSchema
     .create(req.body)
     .then((result) => {
        res.json({
            data: result,
            message: "qoute created successfully",
            status: 200,
        });
     })
     .catch((err) => {
      console.log(err); // FIX: Change `console.log(data.err)` to `console.log(err)`
      return next(err);
     });
 });
// Update quote status
router.put("/update-status/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const { quoteStatus } = req.body;

      const updatedQuotation = await quotationSchema.findByIdAndUpdate(
          id,
          { quoteStatus },
          { new: true }
      );

      if (!updatedQuotation) {
          return res.status(404).json({ message: "Quotation not found" });
      }

      res.status(200).json({ message: "Status updated successfully", updatedQuotation });
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
});

 //get all quotations from the database (REPORTS MAPPING)
 router.route("/").get(async (req, res, next) => {
    await quotationSchema
     .find()
     .then((result) => {
        res.json({
            data: result,
            message: "quotations fetch successfully",
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
    const files = await quotationSchema.find();

    // Create PDF (A4 size: 595 x 842)
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Disposition", 'attachment; filename="quotation_report.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res); // Send PDF to response

    // Title
    doc.fontSize(18).font("Helvetica-Bold").text("Quotation Report", { align: "center", underline: true });
    doc.moveDown(2);

    // Column Headers
    const startX = 40;
    let y = doc.y;
    const colWidths = [30, 70, 80, 100, 80, 80, 60, 80]; // Adjusted widths to fit A4 page

    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("No.", startX, y, { width: colWidths[0] });
    doc.text("Date", startX + colWidths[0], y, { width: colWidths[1] });
    doc.text("Quote #", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
    doc.text("Customer Name", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
    doc.text("Item Description", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
    doc.text("Status", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
    
    doc.text("Total Price", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] , y, { width: colWidths[6] });

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
        doc.text("Item Description", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
        doc.text("Status", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
        
        doc.text("Total Price", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[5] });

        doc.moveDown(0.5);
        doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown();
      }

      y = doc.y;
      const formattedDate = file.date ? file.date.toISOString().split("T")[0] : "N/A";

      doc.fontSize(9).font("Helvetica");
      doc.text(`${index + 1}`, startX, y, { width: colWidths[0] });
      doc.text(formattedDate, startX + colWidths[0], y, { width: colWidths[1] });
      doc.text(file.quoteNumber|| "N/A", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
      doc.text(file.customerName || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
      doc.text(file.itemDescription || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
      doc.text(file.quoteStatus || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
     
      doc.text(file.totalPrice || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] , y, { width: colWidths[6] });

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
     const files = await quotationSchema.find();
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet("Expense Report");

     // Add Header Row
     worksheet.columns = [
       { header: "No.", key: "no", width: 5 },
       { header: "Date", key: "date", width: 15 },
       { header: "Quote Number", key: "quoteNumber", width: 15 },
       { header: "Customer Name", key: "customerName", width: 20 },
       { header: "Description", key: "itemDescription", width: 30 },
       { header: "Quote Status", key: "quoteStatus", width: 20 },
       { header: "Currency", key: "currency", width: 20 },
       { header: "Payment Method", key: "paymentMethod", width: 15 },
       { header: "Quantity", key: "quantity", width: 15 },
       { header: "Unit Price", key: "unitPrice", width: 15 },
       { header: "Vat", key: "vat", width: 15 },
       { header: "Total Price", key: "totalPrice", width: 20 },
     ];

     // Add Data Rows
     files.forEach((file, index) => {
       worksheet.addRow({
         no: index + 1,
         date: file.date ? file.date.toISOString().split("T")[0] : "N/A",
         quoteNumber: file.quoteNumber ? file.quoteNumber.toFixed(2) : "0.00",
         customerName: file.customerName || "N/A",
         itemDescription: file.itemDescription || "N/A",
         quoteStatus: file.quoteStatus || "N/A",
         currency: file.currency || "N/A",
         paymentMethod: file.paymentMethod || "N/A",
         quantity: file.quantity ? file.quantity.toFixed(2) : "0.00",
         unitPrice: file.unitPrice ? file.unitPrice.toFixed(2) : "0.00",
         vat: file.vat ? file.vat.toFixed(2) : "0.00",
         totalPrice: file.totalPrice ? file.totalPrice.toFixed(2) : "0.00",
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


 export {router as quotationRoutes}