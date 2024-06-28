import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import emailIcon from './images/email.png'; // Ensure correct path
import "./Wishlist.css";

const Wishlist = ({ onWishlistUpdate }) => {
  const [wishlistedStudents, setWishlistedStudents] = useState([]);
  const [expandedProfiles, setExpandedProfiles] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
      await axios.post("http://localhost:8080/api/students/wishlist", { wishlist: updatedWishlist }, {
        headers: { "x-auth-token": token }
      });
      onWishlistUpdate(updatedWishlist);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const handleProfileClick = (studentId) => {
    setExpandedProfiles((prevExpanded) =>
      prevExpanded.includes(studentId)
        ? prevExpanded.filter((id) => id !== studentId)
        : [...prevExpanded, studentId]
    );
  };

  const handleHire = async (student) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/students/hire", { student }, {
        headers: { "x-auth-token": token }
      });
      alert('Student hired successfully!');
    } catch (error) {
      console.error("Error hiring student:", error);
    }
  };

  const handleSendEmail = async (student) => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email"); // Get logged-in user's email from localStorage
      const fullName = localStorage.getItem("fullName"); // Get logged-in user's full name from localStorage
      if (!email) {
        alert("User email not found. Please log in again.");
        return;
      }

      await axios.post("http://localhost:8080/api/students/send-email", { student, email, fullName }, {
        headers: { "x-auth-token": token }
      });

      Swal.fire({
        icon: 'success',
        title: 'Email Sent',
        text: 'The email has been sent successfully!',
        showConfirmButton: false,
        timer: 3500, // Increase the timer to hold the pop-up for 2 seconds more
        timerProgressBar: true,
        didOpen: () => {
          setTimeout(() => {
            const tickMark = document.querySelector('.swal2-success-circular-line-right');
            if (tickMark) {
              tickMark.classList.add('fade-in');
            }
          }, 1000); // Delay the tick mark fade-in by 1 second more
        },
        customClass: {
          popup: 'custom-popup' // Optional: Customize the popup as needed
        }
      });
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };

  return (
    <div className="wishlist-container">
      <h2>Wishlist</h2>
      <div className="items-container">
        {wishlistedStudents.map((item, idx) => (
          <div key={`wishlist-item-${idx}`} className="item">
            <div className="profile-header">
              <p onClick={() => handleProfileClick(item._id)} className="profile-name">
                {item.fullName}
              </p>
              <button className="wishlist-button" onClick={() => handleRemoveFromWishlist(item._id)}>
                {'★'}
              </button>
            </div>
            <div className="basic-info">
              <p className="category">Degree: {item.degree}</p>
              <p className="category">Course Name: {item.courseName}</p>
              <p className="category">Graduation Date: {new Date(item.graduationDate).toLocaleDateString()}</p>
              <p className="category">Email: {item.email}</p>
              <p className="category">Hours at Smith: {item.hoursAtSmith}</p>
            </div>
            {expandedProfiles.includes(item._id) && (
              <div className="expanded-profile">
                <p className="category">UID: {item.uid}</p>
                <p className="category">Areas of Interest: {item.areasOfInterest}</p>
                <p className="category">Enrollment Date: {item.enrollmentDate}</p>
                <p className="category">Education: {item.education}</p>
                <p className="category">Work Experience: {item.workExperience}</p>
                <p className="category">Hours Other Jobs: {item.hoursOtherJobs}</p>
                <p className="category">Resume: <a href={item.resume} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                <p className="category">Cover Letter: <a href={item.coverLetter} target="_blank" rel="noopener noreferrer">View Cover Letter</a></p>
              </div>
            )}
            <div className="button-group">
              <button className="hire-button" onClick={() => handleHire(item)}>Hire</button>
              <button className="email-button" onClick={() => handleSendEmail(item)}>
                <img src={emailIcon} alt="Send Email" className="email-icon" />
                Send Email Invite
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;