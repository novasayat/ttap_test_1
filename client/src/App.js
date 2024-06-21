import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MultiFilters from './MultiFilters';
import Wishlist from './Wishlist';
import StudentView from './StudentView'; // Import StudentView component
import Main from './components/Main';
import Signup from './components/Signup';
import Login from './components/Login';
import Layout from './components/Faculty Layout/Layout'; // Import the Layout component

const Home = () => <div>Home Page</div>;

function App() {

  const user = localStorage.getItem("token");

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const handleWishlistUpdate = (updatedWishlist) => {
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <Router>
      {/* <Header /> */}
      <div>
      <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {user && (
            <>
              <Route
                path="/"
                element={<Layout><MultiFilters onWishlistUpdate={handleWishlistUpdate} wishlist={wishlist} /></Layout>}
              />
              <Route
                path="/profile"
                element={<Layout><StudentView /></Layout>}
              />
              <Route
                path="/wishlist"
                element={<Layout><Wishlist wishlist={wishlist} onWishlistUpdate={handleWishlistUpdate} /></Layout>}
              />

            </>
          )}
          {!user && <Route path="/" element={<Navigate replace to="/login" />} />}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;