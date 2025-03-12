import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

let salesSchema = new Schema(
    {
        date: {
            type: Date,
            default: Date.now,
        },
        cashierName: String,
        customerName: String,
        itemDescription: String,
        paymentMethod: String,
        currency: String,
        quantity: {
            type: Number,
            default: 0,
        },
        unitPrice: {
            type: Number,
            default: 0,
        },
        vat: {
            type: Number,
            default: 0,
        },
        totalPrice: {
            type: Number,
            default: 0,
        },
    },
    {
        collection: "salesmodel",
    }
);

export default model("salesmodel", salesSchema);
