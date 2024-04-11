import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import SavedWork from './SavedWork';
import logo from './logo.svg';
import './Homepage.css';
import './SavedWork.css';
import Login from './Login';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const [customerId, setCustomerId] = useState(null);
  const [username, setCustomerName] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const customerId = localStorage.getItem("customerId");
    const username = localStorage.getItem("username");
    
    if (customerId) {
      setCustomerId(customerId);
    }
    if (username) {
      setCustomerName(username);
    }

  });

  const handleSignOut = () => {
    //setCustomerName(null);
    //setCustomerId(null);
    //console.log(username);
    localStorage.removeItem("customerId");
    localStorage.removeItem("username");
    navigate('/login');
  };
  

  return (
    customerId!=null ?
    <div className="homepage-container">
      <nav className="navbar">
        <div className="navbar-brand"><img src={logo} alt="Recapify" className='logo'/></div>
        <div className="user-details">Welcome {username}</div>
        <div className="signout-btn" onClick={handleSignOut}>
        <ExitToAppIcon />
      </div>
      </nav>
      <div className="content">
        <div className="saved-work-section">
          <h2 className='center-heading'>All Recaps</h2>
          <SavedWork />
        </div>
        <div className="file-upload-section">
          <h2>Upload Files</h2>
          <FileUpload />
        </div>
      </div>
    </div> : <Login/>
  );
}

export default Homepage;
