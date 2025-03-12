
import './App.css';
import Footer from './Components/Footer.js';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from "./Dashboard.js"

import SalesModuleDashboard from './SalesModule/Dashboard.js';
import Sales from "./SalesModule/Sales.js"

import Expenses from './ExpensesModule/Expenses.js';
import Stock from './StockModule/Stock.js';
import Quotation from './SalesModule/Quotation.js';
import SalesReports from './SalesModule/SalesReports.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Dashboard/>} />
        <Route path="Sales" element={<Sales/>} />
        <Route path="SalesModuleDashboard" element={<SalesModuleDashboard/>} />    
        <Route path="Quotation" element={<Quotation/>} />
        <Route path="Expenses" element={<Expenses/>} />
        <Route path="Stock" element={<Stock/>} />
        <Route path="SalesReports" element={<SalesReports/>} />


      </Routes>
    </Router>
  );
}

export default App;
