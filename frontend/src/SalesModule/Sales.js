import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Sales = () => {
    const [salesForm, setSalesForm] = useState([]);
    const [salesInsert, setSalesInsert] = useState({});

    const [date, setDate] = useState("");
    const [cashierName, setCashierName] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [currency, setCurrency] = useState("");
    const [quantity, setQuantity] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [vat, setVat] = useState("");
    const [totalPrice, setTotalPrice] = useState("");

    // Recalculate total price whenever quantity, unit price, or VAT change
    useEffect(() => {
        const calculateTotalPrice = () => {
            const quantityValue = parseFloat(quantity) || 0;
            const unitPriceValue = parseFloat(unitPrice) || 0;
            const vatValue = parseFloat(vat) || 0;

            const basePrice = quantityValue * unitPriceValue;
            const vatAmount = (vatValue / 100) * basePrice;
            const total = basePrice + vatAmount;

            setTotalPrice(total.toFixed(2));
        };

        calculateTotalPrice();
    }, [quantity, unitPrice, vat]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const salesInsert = {
            date,
            cashierName,
            customerName,
            itemDescription,
            paymentMethod,
            currency,
            quantity: parseFloat(quantity) || 0,
            unitPrice: parseFloat(unitPrice) || 0,
            vat: parseFloat(vat) || 0,
            totalPrice: parseFloat(totalPrice) || 0,
        };
    
        axios
            .post("https://nexusacccounting.onrender.com/salesmodel/create-sale", salesInsert)
            .then((res) => {
                console.log({ status: res.status });
                setSalesForm((prev) => [...prev, salesInsert]);
                alert(`Sale finalized with a total price of $${totalPrice}`);
            })
            .catch((error) => {
                console.error("Error creating sale:", error);
                alert("Failed to create sale. Please try again.");
            });
    };
    

    return (
        <div>
            <nav className="navbar bg-grey border-bottom border-body mb-3 shadow-sm p-3 rounded bg-dark border-bottom">
                <a className="navbar-brand text-white">
                    <b>CREATE A SALE</b>
                </a>
            </nav>

            <div className="d-flex justify-content-end" style={{ padding: 0 }}>
                <Link to="/salesModuleDashboard" type="button" className="btn btn-primary">
                    BACK
                </Link>
            </div>

            <div className="card mx-auto shadow-lg" style={{ maxWidth: "90rem", marginTop: "1rem" }}>
                <div className="card-body">
                    <p>SALES FORM</p>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "15px" }}>
                            <div className="form-group" style={{ flex: "1" }}>
                                <label htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group" style={{ flex: "1" }}>
                                <label htmlFor="cashierName">Cashier Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="cashierName"
                                    value={cashierName}
                                    onChange={(e) => setCashierName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "15px" }}>
                            <div className="form-group" style={{ flex: "1" }}>
                                <label htmlFor="customerName">Customer Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="customerName"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="itemDescription">Item Description</label>
                            <textarea
                                className="form-control"
                                id="itemDescription"
                                value={itemDescription}
                                onChange={(e) => setItemDescription(e.target.value)}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            <div className="form-group col-md-4" style={{ flex: "1" }}>
                                <label htmlFor="paymentMethod">Payment Option</label>
                                <select
                                    id="paymentMethod"
                                    className="form-control"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option defaultValue>Choose...</option>
                                    <option>Cash</option>
                                    <option>Ecocash</option>
                                    <option>Ecocash Zig</option>
                                    <option>Zig Swipe</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4" style={{ flex: "1" }}>
                                <label htmlFor="currency">Currency</label>
                                <select
                                    id="currency"
                                    className="form-control"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <option defaultValue>Choose...</option>
                                    <option>USD</option>
                                    <option>EUR</option>
                                    <option>ZWL</option>
                                    <option>BWP</option>
                                </select>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: "10px",
                            }}
                        >
                            <div style={{ display: "flex", gap: "15px" }}>
                                <div className="form-group col-md-2" style={{ flexBasis: "200px" }}>
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                                <div className="form-group col-md-2" style={{ flexBasis: "200px" }}>
                                    <label htmlFor="unitPrice">Unit Price</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="unitPrice"
                                        value={unitPrice}
                                        onChange={(e) => setUnitPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "15px" }}>
                                <div className="form-group col-md-2" style={{ flexBasis: "200px" }}>
                                    <label htmlFor="vat">V.A.T (%)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="vat"
                                        value={vat}
                                        onChange={(e) => setVat(e.target.value)}
                                    />
                                </div>
                                <div className="form-group col-md-2" style={{ flexBasis: "200px" }}>
                                    <label htmlFor="totalPrice">Total Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="totalPrice"
                                        value={totalPrice}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary mt-3">
                            FINALIZE
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Sales;
