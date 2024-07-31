import React, { createContext, useState, useEffect } from 'react';
import Axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedinUser, setLoggedinUser] = useState(() => {
    const savedUser = localStorage.getItem('loggedinUser');
    return savedUser ? JSON.parse(savedUser) : false;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get("http://localhost:3010/login")
      .then(res => {
        const isLoggedIn = res.data.loggedIn;
        console.log("API response:", res.data); // Debug statement
        setLoggedinUser(isLoggedIn);
        localStorage.setItem('loggedinUser', JSON.stringify(isLoggedIn));
      })
      .catch(err => console.log("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    setLoggedinUser(true);
    localStorage.setItem('loggedinUser', true);
  };

  const logout = () => {
    Axios.post("http://localhost:3010/logout")
      .then(() => {
        localStorage.removeItem("token");
        setLoggedinUser(false);
        localStorage.removeItem('loggedinUser');
      })
      .catch(err => console.log(err));
  };

  return (
    <AuthContext.Provider value={{ loggedinUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
