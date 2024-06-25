import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Hire.css";

const Hire = () => {
  const [hiredStudents, setHiredStudents] = useState([]);
  const [expandedProfiles, setExpandedProfiles] = useState([]);

  useEffect(() => {
    fetchHiredStudents();
  }, []);

  const fetchHiredStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/students/hired", {
        headers: { "x-auth-token": token }
      });
      setHiredStudents(response.data);
    } catch (error) {
      console.error("Error fetching hired students:", error);
    }
  };

  const handleProfileClick = (studentId) => {
    setExpandedProfiles((prevExpanded) =>
      prevExpanded.includes(studentId)
        ? prevExpanded.filter((id) => id !== studentId)
        : [...prevExpanded, studentId]
    );
  };

  return (
    <div className="hire-container">
      <h2>Hired Students</h2>
      <div className="items-container">
        {hiredStudents.map((item, idx) => (
          <div key={`hire-item-${idx}`} className="item">
            <div className="profile-header">
              <p onClick={() => handleProfileClick(item._id)} className="profile-name">
                {item.fullName}
              </p>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hire;
