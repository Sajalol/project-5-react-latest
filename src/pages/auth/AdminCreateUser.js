import React, { useState } from 'react';
import styles from '../../styles/AdminCreateUser.module.css';
import axios from 'axios';

const AdminCreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  const createUser = async () => {
    try {
      const response = await axios.post('https://rest-api-project5.herokuapp.com/todo/users/create/', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create a new user</h1>
      
      <label htmlFor="username" className={styles.label}>Username</label>
      <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.input} />
      
      <label htmlFor="email" className={styles.label}>Email</label>
      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
      
      <label htmlFor="firstName" className={styles.label}>First Name</label>
      <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles.input} />
      
      <label htmlFor="lastName" className={styles.label}>Last Name</label>
      <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles.input} />

      <label htmlFor="password" className={styles.label}>Password</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} />
      
      <button onClick={createUser} className={styles.button}>Create User</button>
    </div>
  );  
};

export default AdminCreateUser;