import React from 'react';

const Footer = () => {
  return (
<footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>© 2025 ACCOUNTING SOFTWARE</p>
        
      </div>
    </footer>
  );
};

const styles = {
    footer: {
      backgroundColor: '#282c34',
      color: '#fff',
      padding: '20px 0',
      textAlign: 'center',
      position: 'relative',
      bottom: 0,
      width: '100%',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    text: {
      margin: '0',
      fontSize: '14px',
    },
    links: {
      marginTop: '10px',
    },
    link: {
      color: '#61dafb',
      margin: '0 10px',
      textDecoration: 'none',
    }
  };
  
export default Footer;
