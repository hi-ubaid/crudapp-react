import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-title">
        <Link to="/" className="navbar-title-link">CRUD</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/employees" className="nav-link">Employees</Link>
      </div>
    </div>
  );
};
