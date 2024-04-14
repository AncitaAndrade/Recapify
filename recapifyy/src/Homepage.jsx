import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import SavedWork from './SavedWork';
import logo from './logo.svg';
import './Homepage.css';
import './SavedWork.css';
import Login from './Login';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function Homepage() {
  const [customerId, setCustomerId] = useState(null);
  const [username, setCustomerName] = useState(null);
  const navigate = useNavigate();
  
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isSummaryGenerated, setIsSummaryGenerated] = useState(false);

  useEffect(() => {
    const customerId = localStorage.getItem("customerId");
    const username = localStorage.getItem("username");
    
    if (customerId) {
      setCustomerId(customerId);
    }
    if (username) {
      setCustomerName(username);
    }

  },[]);

  const handleSignOut = () => {
    //setCustomerName(null);
    //setCustomerId(null);
    //console.log(username);
    localStorage.removeItem("customerId");
    localStorage.removeItem("username");
    navigate('/login');
  };
  const handleUpload = ( ) => { 
    const summary = "Generated summary text"; 
    setGeneratedSummary(summary);
    setIsSummaryGenerated(true);
  };
  

  const handleSave = () => {
    // logic for saved to all recaps
    console.log('Summary saved:', generatedSummary);
  };

  const handleDiscard = () => {
    setGeneratedSummary('');
  };
 
  const handleDownload = () => {
   
    const blob = new Blob([generatedSummary], { type: 'text/plain' });
    
    const link = document.createElement('a');
    
    link.href = URL.createObjectURL(blob);
    
    link.download = 'summary.txt';
    
    document.body.appendChild(link);
    
    link.click();
    
    document.body.removeChild(link);
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


        <div className="flex-container">
      <div className="file-upload-section">
          <h2> Upload files</h2>
          <FileUpload  onSummaryGenerated={setGeneratedSummary} /> 
          <div className="Summary-section">
          <h2>Generated Summary</h2>
          <textarea className="Summary-textbox" value={generatedSummary} readOnly />
          <div className="button-group">
              <Button variant="contained" color="primary" onClick={handleDiscard}>Discard</Button>
              <Button variant="contained" color="primary" onClick={handleDownload}>Download</Button>
              <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
        </div>
        </div>
        </div>

        
        </div>
      </div>
    </div> : <Login/>
  );
}

export default Homepage;
