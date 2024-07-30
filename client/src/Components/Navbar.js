// Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../Context/AuthContext';

export const Navbar = () => {
  const { loggedinUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="navbar-title">
        <Link to="/" className="navbar-title-link">CRUD</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {loggedinUser && (
          <>
            <Link to="/add" className="nav-link">Add Employees</Link>
            <Link to="/employees" className="nav-link">Employees</Link>
            <Link to="/user" className="nav-link">Profile</Link>
            <button onClick={logout} className="nav-link-button">Logout</button>
          </>
        )}
      </div>
    </div>
  );
};
