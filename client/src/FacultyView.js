import React from 'react';
import MultiFilters from './MultiFilters';

const FacultyView = ({ students, onWishlistUpdate }) => {
  return (
    <div>
      <h2>Faculty View</h2>
      <MultiFilters students={students} onWishlistUpdate={onWishlistUpdate} />
    </div>
  );
};

export default FacultyView;
