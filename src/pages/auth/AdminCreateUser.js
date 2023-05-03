import React, { useState } from 'react';
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
    <div>
      <h1>Create a new user</h1>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label htmlFor="email">Email</label>
      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <label htmlFor="firstName">First Name</label>
      <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <label htmlFor="lastName">Last Name</label>
      <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <button onClick={createUser}>Create User</button>
    </div>
  );
};

export default AdminCreateUser;