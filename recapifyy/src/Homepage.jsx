// Homepage.js
import React from 'react';
import FileUpload from './FileUpload';
import SavedWork from 'recapifyy\src\SavedWork.jsx';
import './Homepage.css';

function Homepage() {
  return (
    <div className="homepage-container">
      <nav className="navbar">
        <div className="navbar-brand">Your App Name</div>
        <div className="user-details">Welcome, John | john.doe@example.com</div>
      </nav>
      <div className="content">
        <div className="saved-work-section">
          <h2>Saved Work</h2>
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
