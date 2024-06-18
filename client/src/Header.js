import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import the CSS file

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">Smith Hire</h1>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/faculty">Faculty View</Link></li>
          <li><Link to="/wishlist">Wishlist</Link></li>          
          <li><button onClick={() => console.log('Logout')}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};  

export default Header;
