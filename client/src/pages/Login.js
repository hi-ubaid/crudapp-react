import React, { useState, useContext } from 'react';
import './Login.css';
import Axios from 'axios';
import { useSuccessMessage } from '../Context/SuccessContext';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const { successMessage, setSuccessMessage } = useSuccessMessage("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  Axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    Axios.post("http://localhost:3010/login", {
      email,
      password,
      isAdmin
    })
      .then(res => {
        if (!res.data.auth) {
          setSuccessMessage(res.data.message);
        } else {
          setEmail("");
          setPassword("");
          setError("");
          setSuccessMessage("Logged In");
          login(res.data.user); // Pass user data to context
          setTimeout(async () => await setSuccessMessage(''), 1500);
          navigate("/add");
        }
      })
      .catch(error => {
        setError("Failed to submit the form. Please try again.");
        console.error("Error:", error);
      });
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label className="superAdmin">Super Admin</label>
          </div>
          <button type="submit" className="submit-button">Login</button>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <span>Don't have an account? <a href="/" >Sign Up</a></span>
        </form>
      </div>
    </div>
  );
};

export default Login;
