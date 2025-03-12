import React from "react";
import { Link } from "react-router-dom";
import { FaDollarSign, FaFileInvoice, FaChartLine } from 'react-icons/fa';
import Footer from '../Components/Footer.js';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav className="" style={styles.navbar}>
        <a className="navbar-brand" style={styles.navbarBrand}>
          <b>SALES MODULE DASHBOARD</b>
        </a>
       
      </nav>

      {/* Back Button */}
      <div className="d-flex justify-content-end">
          <Link to = "/" className="btn btn-primary" style={styles.cardButton}>BACK</Link>

        </div>

      {/* Dashboard Content */}
      <div className="row row-cols-1 row-cols-md-3 g-4" style={styles.cardContainer}>
        {/* Sales Card */}
        <div className="col">
          <div className="card shadow-lg rounded" style={styles.card}>
            <div className="card-body">
              <div style={styles.cardHeader}>
                <FaDollarSign style={styles.icon} />
                <h5 className="card-title">SALES</h5>
              </div>
              <p className="card-text">Create a sale</p>
              <Link to="/Sales" className="btn btn-primary" style={styles.cardButton}>Next</Link>
            </div>
          </div>
        </div>

        {/* Quotations Card */}
        <div className="col">
          <div className="card shadow-lg rounded" style={styles.card}>
            <div className="card-body">
              <div style={styles.cardHeader}>
                <FaFileInvoice style={styles.icon} />
                <h5 className="card-title">QUOTATIONS</h5>
              </div>
              <p className="card-text">Create a quotation</p>
              <Link to="/Quotation" className="btn btn-primary" style={styles.cardButton}>Next</Link>
            </div>
          </div>
        </div>

        {/* Reports Card */}
        <div className="col">
          <div className="card shadow-lg rounded" style={styles.card}>
            <div className="card-body">
              <div style={styles.cardHeader}>
                <FaChartLine style={styles.icon} />
                <h5 className="card-title">REPORTS</h5>
              </div>
              <p className="card-text">View sales reports</p>
              <Link to="/salesReports" className="btn btn-primary" style={styles.cardButton}>Next</Link>
            </div>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',  // Make sure the container takes full height of the viewport
    padding: '0 20px',
  },
  navbar: {
    backgroundColor: 'white',
    padding: '15px 0',
    color: 'black',
    borderBottom: '2px solid #dee2e6',
  },
  navbarBrand: {
    color: 'black',
    fontSize: '24px',
    paddingLeft: '20px',
  },
  backButton: {
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#28a745',
    border: 'none',
  },
  cardContainer: {
    marginTop: '20px',
    flexGrow: 1,  // This ensures the cards take up the remaining space
  },
  card: {
    backgroundColor: '#f8f9fa',
    transition: 'transform 0.2s ease-in-out',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  icon: {
    fontSize: '30px',
    color: '#007bff',
    marginRight: '15px',
  },
  cardButton: {
    marginTop: '10px',
    backgroundColor: '#007bff',
    border: 'none',
    padding: '8px 16px',
    fontSize: '16px',
    borderRadius: '5px',
  },
  footerContainer: {
    marginTop: 'auto',  // Push footer to the bottom
    padding: '20px',
  },
};

export default Dashboard;
