import React, { useState } from 'react';
import './AddEmployee.css';
import Axios from 'axios';

export const AddEmployee = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [team, setTeam] = useState("");
    const [position, setPosition] = useState("");
    const [error, setError] = useState(""); // State to manage error messages

    const handleClickEffect = async () => {
        try {
            await Axios.post("http://localhost:3010/create", {
                name: name,
                age: age,
                team: team,
                position: position
            });
            // Clear the form fields on successful submission
            setName("");
            setAge("");
            setTeam("");
            setPosition("");
            setError(""); // Clear any previous error message
            console.log("Success");
        } catch (error) {
            setError("Failed to submit the form. Please try again.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="form-container">
            <input
                type="text"
                placeholder="Name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Age"
                className="input-field"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />
            <input
                type="text"
                placeholder="Team"
                className="input-field"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
            />
            <input
                type="text"
                placeholder="Position"
                className="input-field"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
            />
            <button className="submit-button" onClick={handleClickEffect}>Submit</button>
            {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
        </div>
    );
};
