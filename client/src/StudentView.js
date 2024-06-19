import React, { useState } from 'react';
import axios from 'axios';
import './StudentView.css';

const StudentView = ({ onSaveStudent }) => {
  const [student, setStudent] = useState({
    name: '',
    areaOfInterest: '',
    department: '',
    hoursAvailable: '',
    studentStatus: '',
    graduationYear: '',
    resume: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleFileChange = (e) => {
    setStudent({ ...student, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(student).forEach(key => {
      formData.append(key, student[key]);
    });

    try {
      const response = await axios.post('/api/students', formData);
      console.log('Student data saved:', response.data);
      onSaveStudent(response.data); // Optionally, if you want to update the state in parent component
    } catch (error) {
      console.error('Error saving student data:', error);
    }

    setStudent({
      name: '',
      areaOfInterest: '',
      department: '',
      hoursAvailable: '',
      studentStatus: '',
      graduationYear: '',
      resume: null
    });
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={student.name} onChange={handleChange} required />
      </label>
      <label>
        Area of Interest:
        <input type="text" name="areaOfInterest" value={student.areaOfInterest} onChange={handleChange} required />
      </label>
      <label>
        Department:
        <input type="text" name="department" value={student.department} onChange={handleChange} required />
      </label>
      <label>
        Hours Available:
        <input type="number" name="hoursAvailable" value={student.hoursAvailable} onChange={handleChange} required />
      </label>
      <label>
        Student Status:
        <select name="studentStatus" value={student.studentStatus} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Undergrad">Undergrad</option>
          <option value="Grad">Grad</option>
        </select>
      </label>
      <label>
        Graduation Year:
        <input type="number" name="graduationYear" value={student.graduationYear} onChange={handleChange} required />
      </label>
      <label>
        Resume:
        <input type="file" name="resume" onChange={handleFileChange} required />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default StudentView;
