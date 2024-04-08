import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import SavedWork from './SavedWork';
import './Homepage.css';
import './SavedWork.css';

function Homepage() {
  const [user, setCustomerId] = useState(null);
  const [username, setCustomerName] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("customerId");
    const username = localStorage.getItem("username")
    if(user){
      setCustomerId(user);
    }
    if(username){
      setCustomerName(username)
    }
  })
  return (
    <div className="homepage-container">
      <nav className="navbar">
        <div className="navbar-brand">Recapify</div>
        <div className="user-details">Welcome {username}</div>
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
    </div>
  );
}

export default Homepage;
