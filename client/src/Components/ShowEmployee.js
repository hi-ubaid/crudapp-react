import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './ShowEmployee.css';

export const ShowEmployee = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [update, setUpdate] = useState(false);
  const [newAge, setNewAge] = useState(0);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await Axios.get("http://localhost:3010/employees");
        setEmployeeList(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleClick = () => {
    setUpdate(true);
  };

  const updateEmployee = (id) => {
    Axios.get("http://localhost:3010/update", {
        age: newAge,
        id:  id
    })
    .then(()=>console.log("Ok error resolved :)"))
  };

  return (
    <div className="show-employee-container">
      <h1>Employee List</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Team</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>
                {employee.age}
                <div className="button-input-container">
                  {!update && (
                    <button onClick={handleClick}>Edit</button>
                  )}
                  {update && (
                    <>
                    <input
                      type="text"
                      placeholder="Update Age"
                      className="show-employee-input-field"
                      value={newAge}
                      onChange={(e) => setNewAge(e.target.value)}
                    />
                    <button onClick={() => updateEmployee(employee.id)}>Update</button>
                    </>
                  )}
                </div>
              </td>
              <td>{employee.team}</td>
              <td>{employee.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
