// Login.js
import React, { useState } from 'react';
import axios from 'axios'; 
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //logic // fetch api

    try {
      // Make API call to login endpoint
      const response = await axios.post('https://recapifyapidev-env.eba-3cwbyj7e.us-east-2.elasticbeanstalk.com/', formData);
      
      // Assuming the API returns some data upon successful login
      
      // Reset the form
      setFormData({
        username: '',
        password: ''
      });
      
      // Redirect the user or perform any other necessary actions upon successful login
    } catch (error) {
      // Handle login errors
      console.error('Error logging in:', error);
    }
  };
    
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <span><a href="./signup">Signup</a></span></p>
    </div>
  );
}

export default Login;
