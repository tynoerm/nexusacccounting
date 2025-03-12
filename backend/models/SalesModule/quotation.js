import mongoose from "mongoose";

const { Schema, model } = mongoose;

const quotationSchema = new Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    quoteNumber: { type: Number, unique: true, required: true }, // Ensure unique quote numbers
    customerName: String,
    itemDescription: String,
    quoteStatus: { type: String, default: "Unpaid" },
    currency: String,
    paymentMethod: String,
    quantity: Number,
    unitPrice: Number,
    vat: Number,
    totalPrice: Number,
  },
  { collection: "quotation" }
);

const Quotation = model("quotation", quotationSchema);

export default Quotation; // ✅ Export the model correctly
