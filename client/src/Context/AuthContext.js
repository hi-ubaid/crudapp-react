// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import Axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedinUser, setLoggedinUser] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:3010/login")
      .then(res => {
        setLoggedinUser(res.data.loggedIn);
      })
      .catch(err => console.log(err));
  }, []);

  const login = () => setLoggedinUser(true);
  const logout = () => {
    Axios.post("http://localhost:3010/logout")
      .then(() => {
        localStorage.removeItem("token");
        setLoggedinUser(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <AuthContext.Provider value={{ loggedinUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
