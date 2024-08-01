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
import AdminProfiles from './pages/AdminProfiles';
import SuperPrivateRoute from './Components/SuperPrivateRoute';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <AuthContext.Consumer>
            {({ loggedinUser, loading }) => {
              return (
                <>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      {loggedinUser && <Navbar />}
                      <Routes>
                        <Route element={<PrivateRoutes />}>
                          <Route path="/add" element={<AddEmployee />} />
                          <Route path="/employees" element={<ShowEmployee />} />
                          <Route path="/user" element={<UserProfile />} />
                          {/* Use SuperPrivateRoute for super admin access */}
                          <Route element={<SuperPrivateRoute />}>
                            <Route path="/admins" element={<AdminProfiles />} />
                          </Route>
                        </Route>
                        <Route element={<PublicRoute />}>
                          <Route path="/" element={<Registration />} />
                          <Route path="/login" element={<Login />} />
                        </Route>
                      </Routes>
                    </>
                  )}
                </>
              );
            }}
          </AuthContext.Consumer>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
