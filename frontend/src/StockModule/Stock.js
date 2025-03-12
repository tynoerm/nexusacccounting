import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Button, Modal, InputGroup, Form } from 'react-bootstrap';



const Stock = () => {

  const [stockForm, setStockForm] = useState([]);
  const [stockInsert, setStockInsert] = useState({});

  const [date, setDate] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [stockDescription, setStockDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [transportCost, setTransportCost] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [receivedBy, setReceivedBy] = useState("");

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [error, setError] = useState("")



  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);


  const filteredStock = stockForm.filter(q => {
    const stockDate = q.date ? new Date(q.date).toISOString().split("T")[0] : "";
    return stockDate === selectedDate;
  });


  useEffect(() => {
    axios
      .get("https://nexusacccounting.onrender.com/stock/")
      .then((res) => {
        setStockForm(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);







  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !supplierName || !stockDescription || !stockQuantity || !transportCost || !buyingPrice || !sellingPrice || !receivedBy) {
      setError("All fields are required");
      return;
    }
    const stringPattern = /^[A-Za-z\s.,!?]+$/;
    if (!stringPattern.test(supplierName) || !stringPattern.test(stockDescription) || !stringPattern.test(receivedBy)) {
      setError("Issued To and Authorised By should only contain letters and spaces.");
      return;
    }

    if (
      isNaN(stockQuantity) || stockQuantity <= 0 ||
      isNaN(transportCost) || transportCost < 0 ||
      isNaN(buyingPrice) || buyingPrice <= 0 ||
      isNaN(sellingPrice) || sellingPrice <= 0
    ) {
      setError("Stock Quantity, Buying Price, and Selling Price should be positive. Transport Cost cannot be negative.");
      return;
    }

    setError("");


    const stockInsert = {
      date,
      supplierName,
      stockDescription,
      stockQuantity,
      transportCost,
      buyingPrice,
      sellingPrice,
      
      receivedBy,
    };
    axios
      .post("https://nexusacccounting.onrender.com/stock/create-stock", stockInsert)
      .then((res) => {
        console.log({ status: res.status });
        setStockForm(prev => [...prev, stockInsert])
      });
    setShow(false)
  }


  const handleDownload = async (type) => {
    try {
      const response = await axios.get(`https://nexusacccounting.onrender.com/stock/download/${type}`, {
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


  return (
    <div >
      <nav className="navbar navbar-dark bg-dark border-bottom border-light py-3">
        <a className="navbar-brand text-white" href="#">
          <b>STOCK MODULE</b>
        </a>
      </nav>


      <div className="d-flex justify-content-between my-4">
        <Button variant="success" onClick={handleShow} className="px-4">
          CREATE STOCK BATCH
        </Button>
        <div className="d-flex justify-content-end">

          <Button
            variant="primary" onClick={() => handleDownload("pdf")} className="px-4"> DOWNLOAD PDF
          </Button>
          <Button
            variant="success" onClick={() => handleDownload("excel")} className="px-4"> DOWNLOAD EXCEL
          </Button>
        </div>

        <Link to="/" className="btn btn-primary px-4">
          BACK
        </Link>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-secondary">Stocks for {selectedDate}</h2>
        <input type="date" className="form-control w-auto" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>





      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        aria-labelledby="stockbatch-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create a Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
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
                <label className="form-label">Supplier Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="supplierName"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                />
              </div>
            </div>

            {/* Customer Information */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Received By</label>
                <input
                  type="text"
                  className="form-control"
                  id="receivedBy"
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="itemDescription" className="form-label">Stock Description</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="stockDescription"
                  value={stockDescription}
                  onChange={(e) => setStockDescription(e.target.value)}
                />
              </div>
            </div>



            {/* Quantity, Unit Price, and VAT */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label"> Stock Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  id="stockQuantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Transport Cost</label>
                <input
                  type="number"
                  className="form-control"
                  id="transportCost"
                  value={transportCost}
                  onChange={(e) => setTransportCost(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Buying Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="buyingPrice"
                  value={buyingPrice}
                  onChange={(e) => setBuyingPrice(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="totalPrice" className="form-label">Selling Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="sellingPrice"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100 mt-4">SAVE A BATCH</Button>
          </form>
        </Modal.Body>
      </Modal>



      <table className="table table-striped table-bordered">
      <thead className="table-dark">
          <tr>
            <th>Date:</th>
            <th>Supplier Name:</th>
            <th>Description:</th>
            <th>Quantity:</th>
            <th>Buying Price:</th>
            <th>Selling Price:</th>
          
            <th>Received By:</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(filteredStock) && filteredStock.length > 0 ? (
            filteredStock.map((stock, index) => (
              <tr key={index}>
                <td>{stock.date ? stock.date.split("T")[0] : "N/A"}</td>
                <td>{stock.supplierName || "N/A"}</td>
                <td>{stock.stockDescription || "N/A"}</td>
                <td>{stock.stockQuantity || "N/A"}</td>
                <td>{stock.buyingPrice || "N/A"}</td> {/* Fixed Buying Price */}
                <td>{stock.sellingPrice || "N/A"}</td>
              
                <td>{stock.receivedBy || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No stock found for the selected date</td> {/* Fixed colSpan to match column count */}
            </tr>
          )}
        </tbody>
      </table>


    </div>
  )
}

export default Stock;