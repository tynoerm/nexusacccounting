import { Button, Modal, InputGroup, Form } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Quotation from "./Quotation";

const SalesReports = () => {


  const [salesReportsForm, setSalesReportsForm] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

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


  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredSales = salesReportsForm.filter(q => {
    const salesDate = q.date ? new Date(q.date).toISOString().split("T")[0] : "";
    return salesDate === selectedDate;
  });

  useEffect(() => {
    axios
      .get("https://nexusacccounting.onrender.com/salesmodel")
      .then((res) => {
        setSalesReportsForm(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])



  const handleDateChange = (e) => {
    setDate(e.target.value);
    const filtered = salesReportsForm.filter(salesreports =>
      salesreports.date.includes(e.target.value)
    );
    setFilteredReports(filtered);
  }


  const handleDownload = async (type) => {
    try {
      const response = await axios.get(`https://nexusacccounting.onrender.com/salesmodel/download/${type}`, {
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
    <div>
      <nav className="navbar navbar-dark bg-dark border-bottom border-light py-3">
        <a className="navbar-brand text-white" href="#">
          <b>SALES REPORTS</b>
        </a>
      </nav>

      <div>

        <div className="d-flex justify-content-end" style={{ padding: 0 }}  >
          <Link to="/" type="button" className="btn btn-success">BACK</Link>

          <div className="d-flex justify-content-center">

            <Button
              variant="primary" onClick={() => handleDownload("pdf")} className="px-4"> DOWNLOAD PDF
            </Button>
            <Button
              variant="success" onClick={() => handleDownload("excel")} className="px-4"> DOWNLOAD EXCEL
            </Button>
          </div>
        </div>

      </div>


      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-secondary">Sales for {selectedDate}</h2>
        <input type="date" className="form-control w-auto" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>



      <table className="table table-striped table-bordered">
      <thead className="table-dark">
          <tr>
            <th>Date:</th>
            <th>Cashier Name:</th>
            <th>Customer Name:</th>
            <th>Item Description:</th>
            <th>Currency:</th>
            <th>Balance</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>VAT</th>
            <th>Total Price</th>
          </tr>
        </thead>


        <tbody>
        {filteredSales.length > 0 ? (
            filteredSales.map((salesmodel, index) => (
              <tr key={index}>
                <td>{salesmodel.date ? salesmodel.date.split("T")[0] : "N/A"}</td>
                <td>{salesmodel.cashierName || "N/A"}</td>
                <td>{salesmodel.customerName || "N/A"}</td>
                <td>{salesmodel.itemDescription || "N/A"}</td>
                <td>{salesmodel.currency || "N/A"}</td>
                <td>{salesmodel.balance || "N/A"}</td>
                <td>{salesmodel.quantity || "N/A"}</td>
                <td>{salesmodel.unitPrice || "N/A"}</td>
                <td>{salesmodel.vat || "N/A"}</td>
                <td>{salesmodel.totalPrice || "N/A"}</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No sales  found per selected date</td> {/* Fix column span to match column count */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SalesReports;