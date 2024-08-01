import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styles from './AdminProfiles.module.css';

const AdminProfiles = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:3010/admins")
      .then(({ data }) => {
        setAdmins(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const toggleAdminStatus = (adminID, currentStatus) => {
    Axios.put("http://localhost:3010/admin/status", {
      adminID,
      status: currentStatus === 1 ? 0 : 1
    })
      .then(() => {
        setAdmins(admins.map(admin => 
          admin.adminID === adminID ? { ...admin, status: currentStatus === 1 ? 0 : 1 } : admin
        ));
      })
      .catch(error => {
        setError(error);
      });
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;

  return (
    <div className={styles.adminsContainer}>
      {admins.map(admin => (
        <div key={admin.adminID} className={styles.profileCard}>
          <div className={styles.profileImageContainer}>
            <img
              src={admin.profilePicture ? `http://localhost:3010/uploads/${admin.profilePicture}` : 'http://localhost:3010/uploads/default-profile.png'}
              alt="Profile"
              className={styles.profileImage}
            />
          </div>
          <div className={styles.profileDetails}>
            <table className={styles.profileTable}>
              <tbody>
                <tr>
                  <td className={styles.profileLabel}>Full Name:</td>
                  <td className={styles.profileValue}>{admin.name}</td>
                </tr>
                <tr>
                  <td className={styles.profileLabel}>Email:</td>
                  <td className={styles.profileValue}>{admin.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
              onClick={() => toggleAdminStatus(admin.adminID, admin.status)}
              className={admin.status === 1 ? styles.toggleButton : styles.disable}
            >
              {admin.status === 1 ? 'Disable' : 'Enable'} Admin
            </button>
        </div>
      ))}
    </div>
  );
}

export default AdminProfiles;
