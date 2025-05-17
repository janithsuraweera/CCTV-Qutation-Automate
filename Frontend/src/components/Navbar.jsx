import React from 'react';
import './Navbar.css';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <nav className="navbar">
      <div className="navbar-title">CCTV Quotation System</div>
      <div className="dark-mode-toggle">
        {/* Dark mode toggle button will go here */}
        <button onClick={toggleDarkMode}>
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 