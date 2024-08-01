import React, { createContext, useState, useEffect } from 'react';
import Axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get("http://localhost:3010/login")
      .then(res => {
        const user = res.data.user;
        setLoggedinUser(user);
        localStorage.setItem('loggedinUser', JSON.stringify(user));
      })
      .catch(err => console.log("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  const login = (user) => {
    setLoggedinUser(user);
    localStorage.setItem('loggedinUser', JSON.stringify(user));
  };

  const logout = () => {
    Axios.post("http://localhost:3010/logout")
      .then(() => {
        setLoggedinUser(null);
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
