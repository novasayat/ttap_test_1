import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Hire.css";

const Hire = ({ onHoursUpdate, students, setStudents }) => {
  const [hiredStudents, setHiredStudents] = useState([]);
  const [expandedProfiles, setExpandedProfiles] = useState([]);
  const [assignedHours, setAssignedHours] = useState({});
  const [error, setError] = useState("");

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

  const handleAssignHours = async (studentId, hours) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8080/api/students/assign-hours", {
        studentId,
        hours
      }, {
        headers: { "x-auth-token": token }
      });

      if (response.status === 400) {
        setError(response.data.message);
      } else {
        setError("");
        // Update the hired students list with the new hours
        setHiredStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId ? { ...student, hoursAtSmith: response.data.hoursAtSmith } : student
          )
        );
        // Update the students state in App
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId ? { ...student, hoursAtSmith: response.data.hoursAtSmith } : student
          )
        );
        // Update assigned hours for the session
        setAssignedHours((prevAssignedHours) => ({
          ...prevAssignedHours,
          [studentId]: hours
        }));
        // Call onHoursUpdate to update other components
        onHoursUpdate(studentId, response.data.hoursAtSmith);
      }
    } catch (error) {
      console.error("Error assigning hours:", error);
    }
  };

  const handleHoursChange = (studentId, value) => {
    setAssignedHours({ ...assignedHours, [studentId]: value });
  };

  const handleHoursSubmit = (studentId, e) => {
    if (e.key === 'Enter') {
      const hours = parseInt(assignedHours[studentId], 10);
      handleAssignHours(studentId, hours);
    }
  };

  return (
    <div className="hire-container">
      <h2>Hired Students</h2>
      {error && <div className="error-message">{error}</div>}
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
                <div className="assign-hours">
                  <input
                    type="number"
                    placeholder="Assign hours"
                    value={assignedHours[item._id] || ''}
                    onChange={(e) => handleHoursChange(item._id, e.target.value)}
                    onKeyDown={(e) => handleHoursSubmit(item._id, e)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hire;
