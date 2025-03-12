import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Button, Modal, InputGroup, Form } from 'react-bootstrap';

const Quotation = () => {
    const [quotationForm, setQuotationForm] = useState([]);
    const [filteredQuotation, setFilteredQuotation] = useState([]);


    const [modalShow, setModalShow] = useState(false);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);


    const [quotationInsert, setQuotationInsert] = useState({});

    const [date, setDate] = useState("");
    const [quoteNumber, setQouteNumber] = useState("1");
    const [customerName, setCustomerName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [quoteStatus, setQuoteStatus] = useState("");
    const [currency, setCurrency] = useState("");
    const [quantity, setQuantity] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [vat, setVat] = useState("");
    const [totalPrice, setTotalPrice] = useState("");




    //fetch all items from the database source
    useEffect(() => {
        axios
            .get("https://nexusacccounting.onrender.com/quotation")
            .then((res) => {
                setQuotationForm(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    // Calculate total price
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

  const handleQuoteNumberChange = () => {
  
  }

    const handleUnitPriceChange = (e) => {
        setUnitPrice(e.target.value);
        calculateTotalPrice();
    };

    const handleVatChange = (e) => {
        setVat(e.target.value);
        calculateTotalPrice();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const quotationInsert = {
            date,
            quoteNumber,
            customerName,
            itemDescription,
            quoteStatus: "Unpaid", // Default status
            currency,
            paymentMethod,
            quantity: parseFloat(quantity) || 0,
            unitPrice: parseFloat(unitPrice) || 0,
            vat: parseFloat(vat) || 0,
            totalPrice: parseFloat(totalPrice) || 0,

        };
        axios
            .post("https://nexusacccounting.onrender.com/quotation/create-quote", quotationInsert)
            .then((res) => {
                setQuotationForm((prev) => [...prev, quotationInsert]);
                setFilteredQuotation((prev) => [...prev, quotationInsert]);
            });
            setShow(false)
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
        const filtered = quotationForm.filter(quotation =>
            quotation.date.includes(e.target.value)
        );
        setFilteredQuotation(filtered);
    };

    const handleQuoteChange = async (quoteId) => {
        try {
            const updatedQuote = quotationForm.find(q => q._id === quoteId);
            const newStatus = updatedQuote.quoteStatus === "Unpaid" ? "Paid" : "Unpaid"; // Toggle status
    
            // Update the status in the backend
            await axios.put(`https://nexusacccounting.onrender.com/quotation/update-status/${quoteId}`, { quoteStatus: newStatus });
    
            // Update the state to reflect the new status
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
          const response = await axios.get(`https://nexusacccounting.onrender.com/quotation/download/${type}`, {
            responseType: "blob", // Important for file download
          });
    
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

    useEffect(() => {
        axios.get('https://nexusacccounting.onrender.com/quotation/get-quotes')
            .then(response => {
                setQuotationForm(response.data);
                setFilteredQuotation(response.data);
            })
            .catch(error => console.error('Error fetching quotations:', error));
    }, []);

          const handleInvoiceSubmit = (e) => {
            e.preventDefault();
          }

    return (
        <div>
            <nav className="navbar navbar-dark bg-dark border-bottom border-light py-3">
                <a className="navbar-brand text-white" href="#">
                    <b>QUOTATIONS</b>
                </a>
                <div className="d-flex justify-content-end"> 
                <Link to="/SalesModuleDashboard" className="btn btn-primary px-4">
                  <b> BACK</b> 
                </Link>

                </div>
            </nav>

            <div className="d-flex justify-content-between my-4">
                <Button variant="primary" onClick={handleShow} className="px-4">
                    CREATE A QUOTE
                </Button>
                <div className="d-flex justify-content-center">

                    <Button
                        variant="primary" onClick={() => handleDownload("pdf")} className="px-4"> DOWNLOAD PDF
                    </Button>
                    <Button
                        variant="success" onClick={() => handleDownload("excel")} className="px-4"> DOWNLOAD EXCEL
                    </Button>
                </div>

               
                <button onClick = {handleShow1} className="btn btn-success px-4"><b>INVOICES</b></button>
            </div>

            {/* Search by Date */}
           

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

            {/* Display Quotation Table */}
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Quote #</th>
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
                    {quotationForm.map((quotation, index) => {
                        return (
                            <tr key={index}>
                                <td>{quotation.date ? quotation.date.split("T")[0] : "N/A"}</td>
                                <td>{quotation.quoteNumber}</td>
                                <td>{quotation.customerName}</td>
                                <td>{quotation.itemDescription}</td>
                                <td>
                                    <button onClick={() => handleQuoteChange(quotation._id)} className="btn btn-success">
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
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Quotation;
