import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './ShowEmployee.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSuccessMessage } from '../Context/SuccessContext';

export const ShowEmployee = () => {
  const [employeeList, setEmployeeList]     = useState([]);
  const [update, setUpdate]                 = useState(false);
  const [newAge, setNewAge]                 = useState(0);
  const {successMessage ,setSuccessMessage} = useSuccessMessage();

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
    Axios.put("http://localhost:3010/update", {
        age: newAge,
        id: id
    })
    .then((res) => {
        setEmployeeList(employeeList.map((employee) => {
            return (
                employee.id === id ? {
                    ...employee,
                    age: newAge
                } : employee
            )
        }));
        setUpdate(false);
        setSuccessMessage("Age Updated!");
        setTimeout(() => setSuccessMessage(''), 1500);
    })
    .catch((error) => {
        console.error("Error updating employee:", error);
        setSuccessMessage("Error updating employee");
        setTimeout(() => setSuccessMessage(''), 1500);
    });
};

const deleteEmployee = (id) => {
  Axios.delete(`http://localhost:3010/delete/${id}`)
  .then((res) => {
      setEmployeeList(employeeList.filter((employee) => employee.id !== id));
      setSuccessMessage("Employee Deleted!");
      setTimeout(() => setSuccessMessage(''), 1500);
  })
  .catch((error) => {
      console.error("Error deleting employee:", error);
      setSuccessMessage("Error deleting employee");
      setTimeout(() => setSuccessMessage(''), 1500);
  });
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>
                {employee.age}
                <div className="button-input-container">
                  {!update && (
                    <div className="edit-button-container">
                      <button className="edit-button" onClick={handleClick}><EditIcon/></button>
                    </div>
                  )}
                  {update && (
                    <>
                      <input
                        type="text"
                        placeholder="Update Age"
                        className="show-employee-input-field"
                        onChange={(e) => setNewAge(e.target.value)}
                      />
                      <button className="update-button" onClick={() => updateEmployee(employee.id)}><CheckCircleIcon/></button>
                    </>
                  )}
                </div>
              </td>
              <td>{employee.team}</td>
              <td>{employee.position}</td>
              <td className="delete-icon">
                <button className="delete-button" onClick={()=>{deleteEmployee(employee.id)}}>
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {successMessage && (
                        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};
