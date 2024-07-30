// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AddEmployee } from './Components/AddEmployee';
import './App.css';
import { ShowEmployee } from './Components/ShowEmployee';
import Registration from './pages/Registration';
import Login from './pages/Login';
import PrivateRoutes from './Components/PrivateRoutes';
import PublicRoute from './Components/PublicRoute';
import { Navbar } from './Components/Navbar';
import { AuthProvider, AuthContext } from './Context/AuthContext';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <AuthContext.Consumer>
            {({ loggedinUser }) => (
              <>
                {loggedinUser && <Navbar />}
                <Routes>
                  <Route element={<PrivateRoutes />}>
                    <Route path="/add" element={<AddEmployee />} />
                    <Route path="/employees" element={<ShowEmployee />} />
                    <Route path="/user" element={<UserProfile />} />
                  </Route>
                  <Route element={<PublicRoute />}>
                    <Route path="/" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>
              </>
            )}
          </AuthContext.Consumer>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
