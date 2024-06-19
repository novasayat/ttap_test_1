import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Wishlist.css";

const Wishlist = ({ onWishlistUpdate }) => {
  const [wishlistedStudents, setWishlistedStudents] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/students/wishlist", {
        headers: { "x-auth-token": token }
      });
      setWishlistedStudents(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async (studentId) => {
    try {
      const updatedWishlist = wishlistedStudents.filter(student => student._id !== studentId);
      setWishlistedStudents(updatedWishlist);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/students/wishlist", { wishlist: updatedWishlist.map(s => s._id) }, {
        headers: { "x-auth-token": token }
      });
      onWishlistUpdate(updatedWishlist);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <div className="wishlist-container">
      <h2>Wishlist</h2>
      <div className="items-container">
        {wishlistedStudents.map((item, idx) => (
          <div key={`wishlist-item-${idx}`} className="item">
            <div className="profile-header">
              <p>{item.fullName}</p>
              <button className="wishlist-button" onClick={() => handleRemoveFromWishlist(item._id)}>
                {'★'}
              </button>
            </div>
            <div className="expanded-profile">
              <p className="category">UID: {item.uid}</p>
              <p className="category">Degree: {item.degree}</p>
              <p className="category">Course Name: {item.courseName}</p>
              <p className="category">Enrollment Date: {item.enrollmentDate}</p>
              <p className="category">Graduation Date: {new Date(item.graduationDate).toLocaleDateString()}</p>
              <p className="category">Email: {item.email}</p>
              <p className="category">Education: {item.education}</p>
              <p className="category">Work Experience: {item.workExperience}</p>
              <p className="category">Areas of Interest: {item.areasOfInterest}</p>
              <p className="category">Hours at Smith: {item.hoursAtSmith}</p>
              <p className="category">Hours Other Jobs: {item.hoursOtherJobs}</p>
              <p className="category">Resume: <a href={item.resume} target="_blank" rel="noopener noreferrer">View Resume</a></p>
              <p className="category">Cover Letter: <a href={item.coverLetter} target="_blank" rel="noopener noreferrer">View Cover Letter</a></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;