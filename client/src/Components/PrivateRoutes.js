import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const PrivateRoutes = () => {
  const { loggedinUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("PrivateRoutes:", { loggedinUser, loading }); // Debug statement
  return loggedinUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
