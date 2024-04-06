import React, { useState } from 'react';
import logo from './logo.png';
import './Signup.css';

function Signup({ onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    
    password: '',
    confirmPassword: '',
    isStudent: true
  });
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value , type , checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox ' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      const response = await fetch('http://recapifyapidev-env.eba-3cwbyj7e.us-east-2.elasticbeanstalk.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const responseData = await response.json();
        const userId = responseData.userId;

     
      setFormData({
        username: '',
        
        password: '',
        confirmPassword: '',
        isStudent: true
      });

      
      setSignupSuccess(true);
      onClose();
    } else {
      console.error('Signup failed:', response.statusText);
    }
      
    } catch (error) {
     
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <img src={logo} alt="recapifyy\src\logo.png" className="logo" />
        <h2>Signup</h2>
        {signupSuccess ? (
          <p className="success-message">Signup successful! Thank you for joining us.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            
            <input
              type="username"
              name="username"
              placeholder="username"
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
            
            <div className="checkbox-container">
            <label htmlFor="isStudent">Are you a student?</label>
                <input
                  type="checkbox"
                  name="isStudent"
                  checked={formData.isStudent}
                  onChange={handleChange}
                />
                 
              
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



