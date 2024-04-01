import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup({ onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isStudent: true
  });
  const [signupSuccess, setSignupSuccess] = useState(false);

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
      // Make API call to signup endpoint
      const signupResponse = await axios.post('https://recapifyapidev-env.eba-3cwbyj7e.us-east-2.elasticbeanstalk.com/', formData);

      // Assuming the API returns some data upon successful signup
      const userId = signupResponse.data.userId;

      // Call another API endpoint to indicate user presence
      await axios.post('https://recapifyapidev-env.eba-3cwbyj7e.us-east-2.elasticbeanstalk.com/', { userId });

      // Additional API call to push customer data to the backend
      await axios.post('https://recapifyapidev-env.eba-3cwbyj7e.us-east-2.elasticbeanstalk.com/', formData);

      // Reset the form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isStudent: true
      });

      // Set signup success state to true
      setSignupSuccess(true);

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
        {signupSuccess ? (
          <p className="success-message">Signup successful! Thank you for joining us.</p>
        ) : (
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
                  type="checkbox"
                  name="isStudent"
                  checked={formData.isStudent}
                  onChange={handleChange}
                />
                Yes, I am a student
              </label>
            </div>
            <button type="submit">Signup</button>
          </form>
        )}
        <p>Already have an account? <span onClick={onClose}><a href='./login'>Login</a></span></p>
      </div>
    </div>
  );
}

export default Signup;

