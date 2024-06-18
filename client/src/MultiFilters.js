import React, { useEffect, useState } from "react";
import { items as students } from "./FilterValues";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "./FilterStyle.css";

function MultiFilters({ onWishlistUpdate, wishlist }) {
  const [selectedFilters, setSelectedFilters] = useState({
    areaOfInterest: [],
    department: [],
    hoursAvailable: [],
    studentStatus: [],
    graduationYear: []
  });

  const [filteredItems, setFilteredItems] = useState(students);
  const [dropdowns, setDropdowns] = useState({
    areaOfInterest: false,
    department: false,
    hoursAvailable: false,
    studentStatus: false,
    graduationYear: false
  });

  const [expandedProfiles, setExpandedProfiles] = useState([]);

  useEffect(() => {
    filterItems();
  }, [selectedFilters]);

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

  const filters = {
    areaOfInterest: ["Data Science", "Data Analytics", "Data Engineering"],
    department: ["Information Systems", "Business Analytics", "Marketing"],
    hoursAvailable: ["0-10", "11-20"],
    studentStatus: ["Undergraduate", "Graduate"],
    graduationYear: ["2024", "2025", "2026", "2027", "2028"]
  };

  const toggleDropdown = (category) => {
    setDropdowns({
      ...dropdowns,
      [category]: !dropdowns[category]
    });
  };

  const closeDropdowns = () => {
    setDropdowns({
      areaOfInterest: false,
      department: false,
      hoursAvailable: false,
      studentStatus: false,
      graduationYear: false
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
        (selectedFilters.areaOfInterest.length === 0 ||
          selectedFilters.areaOfInterest.includes(item.areaOfInterest)) &&
        (selectedFilters.department.length === 0 ||
          selectedFilters.department.includes(item.department)) &&
        (selectedFilters.hoursAvailable.length === 0 ||
          selectedFilters.hoursAvailable.some((range) => {
            const [min, max] = range.split("-").map(Number);
            return item.hoursAvailable >= min && item.hoursAvailable <= max;
          })) &&
        (selectedFilters.studentStatus.length === 0 ||
          selectedFilters.studentStatus.includes(item.studentStatus)) &&
        (selectedFilters.graduationYear.length === 0 ||
          selectedFilters.graduationYear.includes(String(item.graduationYear)))
      );
    });
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
    const isWishlisted = wishlist.some(item => item.id === student.id);
    let updatedWishlist;
    if (isWishlisted) {
      updatedWishlist = wishlist.filter(item => item.id !== student.id);
    } else {
      updatedWishlist = [...wishlist, student];
    }
    onWishlistUpdate(updatedWishlist);
  };

  return (
    <div>
      <div className="filters-container">
        {Object.keys(filters).map((filterCategory) => (
          <div key={filterCategory} className="filter-group">
            <h4 onClick={(e) => { e.stopPropagation(); toggleDropdown(filterCategory); }}>
              {filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1).replace(/([A-Z])/g, ' $1')}
            </h4>
            {dropdowns[filterCategory] && (
              <div className="dropdown">
                {filters[filterCategory].map((value, idx) => (
                  <button
                    onClick={() => handleFilterButtonClick(filterCategory, value)}
                    className={`button ${
                      selectedFilters[filterCategory].includes(value) ? "active" : ""
                    }`}
                    key={`${filterCategory}-${idx}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="items-container">
        {filteredItems.map((item, idx) => (
          <div key={`items-${idx}`} className="item">
            <div className="profile-header">
              <p onClick={() => handleProfileClick(idx)}>{item.name}</p>
              <button
                className={`wishlist-button ${wishlist.some(wishItem => wishItem.id === item.id) ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleWishlistClick(item); }}
              >
                {wishlist.some(wishItem => wishItem.id === item.id) ? '★' : '☆'}
              </button>
            </div>
            <TransitionGroup>
              {expandedProfiles.includes(idx) && (
                <CSSTransition
                  key={idx}
                  timeout={300}
                  classNames="expand"
                >
                  <div className="expanded-profile">
                    <p className="category">Area of Interest: {item.areaOfInterest}</p>
                    <p className="category">Department: {item.department}</p>
                    <p className="category">Hours Available: {item.hoursAvailable}</p>
                    <p className="category">Student Status: {item.studentStatus}</p>
                    <p className="category">Graduation Year: {item.graduationYear}</p>
                    {/* Add more detailed info as needed */}
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
