import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSuccessMessage } from '../Context/SuccessContext';
import './Registration.css';

const Registration = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState("");
    const { successMessage, setSuccessMessage } = useSuccessMessage();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic Validation
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords must match.");
            return;
        }

        if (name.length < 2 || name.length > 15) {
            setError("Name must be between 2 and 15 characters.");
            return;
        }

        if (password.length < 6 || password.length > 16) {
            setError("Password must be between 6 and 16 characters.");
            return;
        }

        if (profilePicture && profilePicture.size > 2 * 1024 * 1024) {
            setError("Profile picture must be less than 2 MB.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profilePicture', profilePicture);

        Axios.post("http://localhost:3010/register", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            // Clear the form fields on successful submission
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setProfilePicture(null);
            setError(""); // Clear any previous error message
            console.log("Success");
            navigate('/add');
        
            setSuccessMessage("Registered!");
            setTimeout(() => setSuccessMessage(''), 1500);
        })
        .catch(error => {
            setError("Failed to submit the form. Please try again.");
            console.error("Error:", error);
        });
    };

    return (
        <div className="registration-container">
            <form className="registration-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <input
                        type="file"
                        id="profilePicture"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="submit-button">Register</button>
                {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}
                
                <span>Already have an account? <a href="/login" >Login</a></span>
            </form>
        </div>
    );
};

export default Registration;
