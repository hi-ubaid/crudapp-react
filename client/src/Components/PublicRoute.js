import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const PublicRoute = () => {
  const { loggedinUser } = useContext(AuthContext);

  return loggedinUser ? <Navigate to="/employees" /> : <Outlet />;
};

export default PublicRoute;
