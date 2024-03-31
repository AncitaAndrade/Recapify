// SignupModal.js
import React, { useState } from 'react';
import axios from 'axios'; 
import './Signup.css';

function Signup({ onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isStudent: true // default value is true
  });

  const handleChange = (e) => {
    const { name, value , type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox'? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //logic

    try {
      //  API call to signup 
      const response = await axios.post('https://recapifyapidev-env.eba-3cwbyj7e.us-east-2.elasticbeanstalk.com/', formData);
      
      // Assuming the API returns some data upon successful signup
      
      // Reset the form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isStudent: true
      });
      
      // Close the modal after successful signup
      onClose();
      
      // Redirect the user or perform any other necessary actions upon successful signup
    } catch (error) {
      // Handle signup errors
      console.error('Error signing up:', error);
    }

    
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <div>
            <label>
              <input
                type="radio"
                name="isStudent"
                value={true}
                checked={formData.isStudent}
                onChange={handleChange}
              />
              Yes, I am a student
            </label>
            <label>
              <input
                type="radio"
                name="isStudent"
                value={false}
                checked={!formData.isStudent}
                onChange={handleChange}
              />
              No, I am not a student
            </label>
          </div>
          <button type="submit">Signup</button>
        </form>
        <p>Already have an account? <span onClick={onClose}><a href='./login'>Login</a></span></p>
      </div>
    </div>
  );
}

export default Signup;
