import React from 'react';

const StudentProfileList = ({ students, onAddToWishlist }) => {
  return (
    <div>
      <h2>Student Profile List</h2>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            {student.name}
            <button onClick={() => onAddToWishlist(student.id)}>Add to Wishlist</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentProfileList;
