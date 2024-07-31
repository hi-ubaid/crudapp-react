import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const PublicRoute = () => {
  const { loggedinUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("PublicRoute:", { loggedinUser, loading }); // Debug statement
  return loggedinUser ? <Navigate to="/employees" /> : <Outlet />;
};

export default PublicRoute;
