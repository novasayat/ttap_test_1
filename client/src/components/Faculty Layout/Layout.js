// Layout.js
import React from 'react';
import Header from '../Main';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;