import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const SuperPrivateRoute = () => {
  const { loggedinUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is logged in and is a super admin
  return loggedinUser && loggedinUser.isSuperAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default SuperPrivateRoute;
