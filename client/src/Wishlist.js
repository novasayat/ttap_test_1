import React from 'react';
import './Wishlist.css';

const Wishlist = ({ wishlist, onWishlistUpdate }) => {
  const handleRemoveFromWishlist = (student) => {
    const updatedWishlist = wishlist.filter(item => item.id !== student.id);
    onWishlistUpdate(updatedWishlist);
  };

  return (
    <div className="wishlist-container">
      <h2>Wishlist</h2>
      <div className="items-container">
        {wishlist.map((item, idx) => (
          <div key={`wishlist-item-${idx}`} className="item">
            <div className="profile-header">
              <p>{item.name}</p>
              <button className="wishlist-button" onClick={() => handleRemoveFromWishlist(item)}>
                {'★'}
              </button>
            </div>
            <div className="expanded-profile">
              <p className="category">Area of Interest: {item.areaOfInterest}</p>
              <p className="category">Department: {item.department}</p>
              <p className="category">Hours Available: {item.hoursAvailable}</p>
              <p className="category">Student Status: {item.studentStatus}</p>
              <p className="category">Graduation Year: {item.graduationYear}</p>
              {/* Add more detailed info as needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
