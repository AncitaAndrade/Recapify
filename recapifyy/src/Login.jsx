import React, { useState } from 'react';
import './Login.css';
import logo from './logo.png';  

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

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
      const response = await fetch('http://recapifyapidev-env.eba-3cwbyj7e.us-east-2.elasticbeanstalk.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      console.log(response)
      console.log(response.data)
      if (response.ok) {
        // setFormData({
        //   username: '',
        //   password: ''
        // });
        //window.location.href = '/';
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred while logging in');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="recapifyy\src\logo.png" className="logo" />
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
        {error && <p className="error-message">{error}</p>}
      </form>
      <p>Don't have an account? <span><a href="./signup">Signup</a></span></p>
    </div>
  );
}

export default Login;
