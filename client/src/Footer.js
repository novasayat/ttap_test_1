import React from 'react';

const footerStyle = {
  backgroundColor: '#f8f9fa',
  padding: '10px',
  borderTop: '1px solid #dee2e6',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  textAlign: 'center',
};

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
