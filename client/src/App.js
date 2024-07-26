import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { AddEmployee } from './Components/AddEmployee';
import './App.css';
import { ShowEmployee } from './Components/ShowEmployee';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<AddEmployee />} />
          <Route path="/employees" element={<ShowEmployee/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
