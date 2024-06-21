import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "./FilterStyle.css";

function MultiFilters({ onWishlistUpdate, wishlist }) {
  const [selectedFilters, setSelectedFilters] = useState({
    degree: [],
    courseName: [],
    enrollmentDate: [],
    areasOfInterest: [],
    hoursAtSmith: []
  });

  const [students, setStudents] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [dropdowns, setDropdowns] = useState({
    degree: false,
    courseName: false,
    enrollmentDate: false,
    areasOfInterest: false,
    hoursAtSmith: false
  });

  const [expandedProfiles, setExpandedProfiles] = useState([]);
  const [filters, setFilters] = useState({
    degree: [],
    courseName: [],
    enrollmentDate: [],
    areasOfInterest: [],
    hoursAtSmith: []
  });

  useEffect(() => {
    fetchFilters();
    fetchStudents();
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedFilters, students]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const filtersContainer = document.querySelector('.filters-container');
      if (filtersContainer && !filtersContainer.contains(event.target)) {
        closeDropdowns();
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchFilters = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/students/filters", {
        headers: { "x-auth-token": token }
      });
      setFilters(response.data);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await axios.get("http://localhost:8080/api/students", {
        headers: { "x-auth-token": token }
      });
      console.log(response.data);
      setStudents(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const toggleDropdown = (category) => {
    setDropdowns({
      ...dropdowns,
      [category]: !dropdowns[category]
    });
  };

  const closeDropdowns = () => {
    setDropdowns({
      degree: false,
      courseName: false,
      enrollmentDate: false,
      areasOfInterest: false,
      hoursAtSmith: false
    });
  };

  const handleFilterButtonClick = (filterCategory, selectedValue) => {
    const currentFilters = selectedFilters[filterCategory];
    if (currentFilters.includes(selectedValue)) {
      const newFilters = currentFilters.filter((el) => el !== selectedValue);
      setSelectedFilters({
        ...selectedFilters,
        [filterCategory]: newFilters
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [filterCategory]: [...currentFilters, selectedValue]
      });
    }
  };

  const filterItems = () => {
    let tempItems = students.filter((item) => {
      return (
        (selectedFilters.degree.length === 0 || selectedFilters.degree.includes(item.degree)) &&
        (selectedFilters.courseName.length === 0 || selectedFilters.courseName.includes(item.courseName)) &&
        (selectedFilters.enrollmentDate.length === 0 || selectedFilters.enrollmentDate.includes(item.enrollmentDate)) &&
        (selectedFilters.areasOfInterest.length === 0 || selectedFilters.areasOfInterest.includes(item.areasOfInterest)) &&
        (selectedFilters.hoursAtSmith.length === 0 || selectedFilters.hoursAtSmith.includes(item.hoursAtSmith))
      );
    });
    tempItems.sort((a, b) => a.fullName.localeCompare(b.fullName)); // Sort filtered items alphabetically by fullName
    setFilteredItems(tempItems);
  };

  const handleProfileClick = (idx) => {
    setExpandedProfiles((prevExpanded) => {
      if (prevExpanded.includes(idx)) {
        return prevExpanded.filter((id) => id !== idx);
      } else {
        return [...prevExpanded, idx];
      }
    });
  };

  const handleWishlistClick = (student) => {
    const isWishlisted = wishlist.some(item => item._id === student._id);
    let updatedWishlist;
    if (isWishlisted) {
      updatedWishlist = wishlist.filter(item => item._id !== student._id);
    } else {
      updatedWishlist = [...wishlist, student];
    }
    onWishlistUpdate(updatedWishlist);
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({
      degree: [],
      courseName: [],
      enrollmentDate: [],
      areasOfInterest: [],
      hoursAtSmith: []
    });
  };

  return (
    <div>
      <div className="filters-container">
        {Object.keys(filters).map((filterCategory) => (
          <div key={filterCategory} className="filter-group">
            <h4 onClick={(e) => { e.stopPropagation(); toggleDropdown(filterCategory); }}>
              {filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1).replace(/([A-Z])/g, ' $1')}
            </h4>
            <CSSTransition
              in={dropdowns[filterCategory]}
              timeout={300}
              classNames="expand"
              unmountOnExit
            >
              <div className="dropdown">
                {filters[filterCategory].map((value, idx) => (
                  <button
                    onClick={() => handleFilterButtonClick(filterCategory, value)}
                    className={`button ${selectedFilters[filterCategory].includes(value) ? "active" : ""}`}
                    key={`${filterCategory}-${idx}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </CSSTransition>
          </div>
        ))}
        <button className="clear-filters-button" onClick={handleClearAllFilters}>Clear Filters</button>
      </div>

      <div className="items-container">
        {filteredItems.map((item, idx) => (
          <div key={`items-${idx}`} className="item">
            <div className="profile-header">
              <p onClick={() => handleProfileClick(idx)}>{item.fullName}</p>
              <button
                className={`wishlist-button ${wishlist.some(wishItem => wishItem._id === item._id) ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleWishlistClick(item); }}
              >
                {wishlist.some(wishItem => wishItem._id === item._id) ? '★' : '☆'}
              </button>
            </div>
            <div className="basic-info">
              <p className="category">Degree: {item.degree}</p>
              <p className="category">Course Name: {item.courseName}</p>
              <p className="category">Graduation Date: {new Date(item.graduationDate).toLocaleDateString()}</p>
              <p className="category">Email: {item.email}</p>
              <p className="category">Hours at Smith: {item.hoursAtSmith}</p>
            </div>
            <TransitionGroup>
              {expandedProfiles.includes(idx) && (
                <CSSTransition key={idx} timeout={300} classNames="expand">
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
                </CSSTransition>
              )}
            </TransitionGroup>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultiFilters;
