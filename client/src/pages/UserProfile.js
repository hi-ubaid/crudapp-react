import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    id: 0,
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:3010/login", { withCredentials: true })
      .then(({ data }) => {
        if (!data.loggedIn) {
          console.log(data.message);
        } else {
          const { name, email, id, profilePicture } = data.user;
          setUser({
            name,
            email,
            id,
            profilePicture: profilePicture ? `http://localhost:3010/uploads/${profilePicture}` : 'http://localhost:3010/uploads/default-profile.png',
          });
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
    <div className={styles.profileContainer}>
      <div className={styles.profileContent}>
        <div className={styles.profileImageContainer}>
          <img
            src={user.profilePicture}
            alt="Profile"
            className={styles.profileImage}
          />
        </div>
        <div className={styles.profileDetails}>
          <table className={styles.profileTable}>
            <tbody>
              <tr>
                <td className={styles.profileLabel}>Full Name:</td>
                <td className={styles.profileValue}>{user.name}</td>
              </tr>
              <tr>
                <td className={styles.profileLabel}>Email:</td>
                <td className={styles.profileValue}>{user.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
