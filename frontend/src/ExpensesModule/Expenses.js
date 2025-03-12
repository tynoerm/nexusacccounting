import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Button, Modal, InputGroup, Form } from 'react-bootstrap';



const Expenses = () => {


  const [expensesForm, setExpensesForm] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);


  const [date, setDate] = useState("");
  const [issuedTo, setIssuedTo] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [expenseType, setExpenseType] = useState("");

  const [amount, setAmount] = useState("");
  const [authorisedBy, setAuthorisedBy] = useState("");

const [error , setError] = useState("");

  const handleDateChange = (e) => {
    setDate(e.target.value);
    const filtered = expensesForm.filter(expenses =>
      expenses.date.includes(e.target.value)
    );
    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    axios
      .get("https://accounting-system-1.onrender.com/expense/")
      .then((res) => {
        setExpensesForm(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
  
    // String Validation (Ensure they are not empty and no special characters if needed)
    if (!date || !issuedTo || !description || !paymentMethod || !expenseType || !authorisedBy) {
      setError("All fields are required.");
      return;
    }
  
    // Allow only letters, spaces, and basic punctuation for the string fields (adjust as necessary)
    const stringPattern = /^[A-Za-z\s.,!?]+$/;
    if (!stringPattern.test(issuedTo) || !stringPattern.test(authorisedBy)) {
      setError("Issued To and Authorised By should only contain letters and spaces.");
      return;
    }
  
    if (description.length < 5) {
      setError("Description should be at least 5 characters long.");
      return;
    }
  
    // Number Validation for Amount (Ensure it's a valid positive number)
    if (isNaN(amount) || amount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
  
    // Clear error message before submitting
    setError("");
  
    const expensesInsert = {
      date,
      issuedTo,
      description,
      paymentMethod,
      expenseType,
      amount,
      authorisedBy
    };
  
    // Send data to the backend
    axios
      .post("https://https://nexusacccounting.onrender.com/expense/create-expense", expensesInsert)
      .then((res) => {
        console.log({ status: res.status });
        setExpensesForm((prev) => [...prev, expensesInsert]);
        setShow(false);
      })
      .catch((error) => {
        console.error(error);
        setError("An error occurred while submitting the expense.");
      });
      setShow(false)
  };


  const handleDownload = async (type) => {
    try {
      const response = await axios.get(`https://accounting-system-1.onrender.com/expense/download/${type}`, {
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
          <b>EXPENSES MANAGEMENT</b>
        </a>

      </nav>


      <div className="d-flex justify-content-between my-4">
        <Button variant="success" onClick={handleShow} className="px-4">
          CREATE AN EXPENSE
        </Button>
        <div className="d-flex justify-content-center">

          <Button
            variant="primary" onClick={() => handleDownload("pdf")} className="px-4"><b> DOWNLOAD PDF</b>
          </Button>
          <Button
            variant="success" onClick={() => handleDownload("excel")} className="px-4"> DOWNLOAD EXCEL
          </Button>
        </div>
        <Link to="/" className="btn btn-primary px-4">
          BACK
        </Link>
        
      </div>


      





      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        aria-labelledby="expenses-form"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create an Expense</Modal.Title>
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
                <label className="form-label">Issued To:</label>
                <input
                  type="text"
                  className="form-control"
                  id="issuedTo"
                  value={issuedTo}
                  onChange={(e) => setIssuedTo(e.target.value)}
                />
              </div>
            </div>

            {/* Customer Information */}


            <div className="col-md-6">
              <label className="form-label">Description</label>
              <textarea
                type="text"
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
                <label >Type of Expense</label>
                <select
                  id="expenseType"
                  className="form-control"
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value)}
                >
                  <option defaultValue>Choose...</option>
                  <option>food</option>
                  <option>transport fee</option>
                  <option>fuel</option>
                  <option>accommodation</option>
                </select>
              </div>
            </div>



            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="vat" className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="totalPrice" className="form-label">AuthorisedBy</label>
                <input
                  type="text"
                  className="form-control"
                  id="authorisedBy"
                  value={authorisedBy}
                  onChange={(e) => setAuthorisedBy(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100 mt-4">FiNALIZE EXPENSE</Button>
          </form>
        </Modal.Body>
      </Modal>







      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Date:</th>
            <th>Issued To:</th>
            <th>Description:</th>
            <th>Payment Method:</th>
            <th>Expense Type:</th>
            <th>Amount:</th>
            <th>Authorised By:</th>

          </tr>
        </thead>

        <tbody>
          {expensesForm.map((expense, index) => {
            return (
              <tr key={index}>
                <td>{expense.date ? expense.date.split("T")[0] : "N/A"}</td> {/* Handle null dates */}
                <td>{expense.issuedTo || "N/A"}</td>
                <td>{expense.description || "N/A"}</td>
                <td>{expense.paymentMethod || "N/A"}</td>
                <td>{expense.expenseType || "N/A"}</td>
                <td>{expense.amount !== undefined ? expense.amount : "N/A"}</td>
                <td>{expense.authorisedBy || "N/A"}</td>

              </tr>
            );
          })}
        </tbody>

      </table>


    </div>
  )
}

export default Expenses;