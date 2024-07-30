import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styles from './UserProfile.css';

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:3010/login", { withCredentials: true })
      .then(({ data }) => {
        if (!data.loggedIn) {
          console.log(data.message);
        } else {
          const { name, email, id } = data.user;
          setName(name);
          setEmail(email);
          setId(id);
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>User Profile</h1>
      <p className={styles.info}>Name: {name}</p>
      <p className={styles.info}>Email: {email}</p>
      <p className={styles.info}>Id: {id}</p>
    </div>
  );
}

export default UserProfile;
