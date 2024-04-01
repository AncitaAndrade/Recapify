import React, { useState } from 'react';
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

    try {
      // Make API call to login endpoint
      const response = await fetch('http://recapifyapidev-env.eba-3cwbyj7e.us-east-2.elasticbeanstalk.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Assuming the API returns some data upon successful login
      if (response.ok) {
        // Reset the form
        setFormData({
          username: '',
          password: ''
        });
        
        // Redirect the user to the homepage upon successful login using window.location.href
        window.location.href = '/'; // Replace '/' with the actual URL of your homepage
      } else {
        // Handle login errors
        console.error('Error logging in:', response.statusText);
      }
    } catch (error) {
      // Handle other login errors
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
