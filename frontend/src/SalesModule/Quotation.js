import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

const Quotation = () => {
    const [quotationForm, setQuotationForm] = useState([]);
    const [filteredQuotation, setFilteredQuotation] = useState([]);

    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);

    const [date, setDate] = useState("");
    const [quoteNumber, setQuoteNumber] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [quoteStatus, setQuoteStatus] = useState("Unpaid");
    const [currency, setCurrency] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [unitPrice, setUnitPrice] = useState(0);
    const [vat, setVat] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    
    // Filter quotations based on selected date
    const filteredQuotations = quotationForm.filter(q => q.date?.split("T")[0] === selectedDate);

    // Fetch all quotations
    useEffect(() => {
        axios.get("https://nexusacccounting.onrender.com/quotation")
            .then(res => setQuotationForm(res.data.data))
            .catch(error => console.error("Error fetching quotations:", error));
    }, []);

    

    
    const handleUnitPriceChange = (e) => {
        setUnitPrice(e.target.value);
        calculateTotalPrice();
    };

    const handleVatChange = (e) => {
        setVat(e.target.value);
        calculateTotalPrice();
    };
    const calculateTotalPrice = () => {
        const quantityValue = parseFloat(quantity) || 0;
        const unitPriceValue = parseFloat(unitPrice) || 0;
        const vatValue = parseFloat(vat) || 0;

        const basePrice = quantityValue * unitPriceValue;
        const vatAmount = (vatValue / 100) * basePrice;
        const total = basePrice + vatAmount;

        setTotalPrice(total.toFixed(2));
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
        calculateTotalPrice();
    };

  

    // Handle quotation form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!date || !quoteNumber || !customerName || !itemDescription || !quoteStatus || !currency || !paymentMethod || !quantity || !unitPrice || !vat || !totalPrice) {
            return setError("All fields are required");
        }

        const quotationInsert = {
            date, quoteNumber, customerName, itemDescription,
            quoteStatus: "Unpaid",
            currency, paymentMethod, quantity, unitPrice, vat, totalPrice
        };

        axios.post("https://nexusacccounting.onrender.com/quotation/create-quote", quotationInsert)
            .then(() => {
                setQuotationForm(prev => [...prev, quotationInsert]);
                setFilteredQuotation(prev => [...prev, quotationInsert]);
                setQuoteNumber(prev => prev + 1);
                resetForm();
                setShow(false);
            })
            .catch(error => console.error("Error creating quote:", error));
    };

    const resetForm = () => {
        setDate("");
        setCustomerName("");
        setItemDescription("");
        setQuoteStatus("Unpaid");
        setCurrency("");
        setPaymentMethod("");
        setQuantity(0);
        setUnitPrice(0);
        setVat(0);
        setTotalPrice(0);
    };

    const handleQuoteChange = async (quoteId) => {
        try {
            const updatedQuote = quotationForm.find(q => q._id === quoteId);
            const newStatus = updatedQuote.quoteStatus === "Unpaid" ? "Paid" : "Unpaid";

            await axios.put(`https://nexusacccounting.onrender.com/quotation/update-status/${quoteId}`, { quoteStatus: newStatus });

            setQuotationForm(prev =>
                prev.map(quotation =>
                    quotation._id === quoteId ? { ...quotation, quoteStatus: newStatus } : quotation
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDownload = async (type) => {
        try {
            const response = await axios.get(`https://nexusacccounting.onrender.com/quotation/download/${type}`, { responseType: "blob" });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `file.${type}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };
    
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleShow1 = () => setShow1(true);
    const handleClose1 = () => setShow1(false);

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column bg-light">
            <nav className="navbar navbar-dark bg-dark border-bottom border-light py-3">
                <Link to="/SalesModuleDashboard" className="btn btn-primary">
                    <b>BACK</b>
                </Link>
            </nav>

            <div className="d-flex justify-content-between my-4">
                <Button variant="primary" onClick={() => setShow(true)}>CREATE A QUOTE</Button>
                <Button variant="primary" onClick={() => handleDownload("pdf")}>DOWNLOAD PDF</Button>
                <Button variant="success" onClick={() => handleDownload("excel")}>DOWNLOAD EXCEL</Button>
                <Button variant="success" onClick={() => setShow1(true)}>INVOICES</Button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-secondary">Quotations for {selectedDate}</h2>
                <input type="date" className="form-control w-auto" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>

            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Item</th>
                        <th>Status</th>
                        <th>Currency</th>
                        <th>Payment</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>VAT</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQuotations.length > 0 ? (
                        filteredQuotations.map((quotation, index) => (
                            <tr key={index}>
                                <td>{quotation.date.split("T")[0]}</td>
                                <td>{quotation.customerName}</td>
                                <td>{quotation.itemDescription}</td>
                                <td>
                                    <button className={`btn ${quotation.quoteStatus === "Paid" ? "btn-success" : "btn-warning"}`} onClick={() => handleQuoteChange(quotation._id)}>
                                        {quotation.quoteStatus}
                                    </button>
                                </td>
                                <td>{quotation.currency}</td>
                                <td>{quotation.paymentMethod}</td>
                                <td>{quotation.quantity}</td>
                                <td>{quotation.unitPrice}</td>
                                <td>{quotation.vat}</td>
                                <td>{quotation.totalPrice}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">No quotations for selected date</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="xl"
                aria-labelledby="quotation-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>CREATE A NEW QUOTE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        {/* Form Fields */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="quoteNumber" className="form-label">Quote #</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quoteNumber"
                                    value={quoteNumber}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="customerName" className="form-label">Customer Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="customerName"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="itemDescription" className="form-label">Item Description</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    id="itemDescription"
                                    value={itemDescription}
                                    onChange={(e) => setItemDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Price and Payment Details */}
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

                        {/* Quantity, Unit Price, and VAT */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quantity"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="unitPrice" className="form-label">Unit Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="unitPrice"
                                    value={unitPrice}
                                    onChange={handleUnitPriceChange}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="vat" className="form-label">VAT (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="vat"
                                    value={vat}
                                    onChange={handleVatChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="totalPrice" className="form-label">Total Price</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="totalPrice"
                                    value={totalPrice}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button variant="primary" type="submit" className="w-100 mt-4">Finalize Quote</Button>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal
                show={show1}
                onHide={handleClose1}
                backdrop="static"
                keyboard={false}
                size="xl"
                aria-labelledby="quotation-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>INVOICES</Modal.Title>
                </Modal.Header>
                <Button onClick={handleDownload}><b>Download File</b></Button>
                <Modal.Body>
                    
                <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Date</th>
                        
                        <th>Customer</th>
                        <th>Item</th>
                        
                        <th>Currency</th>
                        <th>Payment</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>VAT</th>
                        <th>Total</th>

                    </tr>
                </thead>


                <tbody>
                    {quotationForm.map((quotation, index) => {
                        return (
                            <tr key={index}>
                                <td>{quotation.date ? quotation.date.split("T")[0] : "N/A"}</td>
                                
                                <td>{quotation.customerName}</td>
                                <td>{quotation.itemDescription}</td>
                               
                                <td>{quotation.currency}</td>
                                <td>{quotation.paymentMethod}</td>
                                <td>{quotation.quantity}</td>
                                <td>{quotation.unitPrice}</td>
                                <td>{quotation.vat}</td>
                                <td>{quotation.totalPrice}</td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
                </Modal.Body>
            </Modal>


        </div>
    );
};

export default Quotation;
