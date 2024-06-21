import React, { useEffect } from 'react';

const footerStyle = {
  backgroundColor: '#f8f9fa',
  padding: '10px',
  borderTop: '1px solid #dee2e6',
  textAlign: 'center',
};

const Footer = () => {
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        footer.style.position = 'static';
      } else {
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer style={footerStyle}>
      <p>&copy; University of Maryland. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
