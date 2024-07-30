// PrivateRoutes.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const PrivateRoutes = () => {
  const { loggedinUser } = useContext(AuthContext);
  
  return loggedinUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
