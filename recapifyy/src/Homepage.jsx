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

const url = "http://recapify.us-east-2.elasticbeanstalk.com/";

function Homepage() {
  const [customerId, setCustomerId] = useState(null);
  const [username, setCustomerName] = useState(null);
  const [recaps, setRecaps] = useState([]);
  const navigate = useNavigate();
  
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isSummaryGenerated, setIsSummaryGenerated] = useState(false);
  const [refresh, setRefresh] = useState(false);
  
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
    localStorage.removeItem("customerId");
    localStorage.removeItem("username");
    navigate('/login');
  };

  const handleUpload = ( ) => { 
    const summary = "Generated summary text"; 
    setGeneratedSummary(summary);
    setIsSummaryGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSummary)
      .then(() => {
        console.log('Summary copied to clipboard:', generatedSummary);
      })
      .catch(error => {
        console.error('Error copying summary to clipboard:', error);
      });
  };

  const handleSave = async () => {
    const currentDate = new Date();
    const defaultTitle = `${currentDate.toDateString()} Summary`;
    const title = window.prompt('Enter the title:', defaultTitle);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerId: customerId,
        summaryHeading: title,
        summary: generatedSummary.toString()
      })
    };
    try {
      const response = await fetch(`${url}save_summary`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch recap details. Status: ' + response.status);
      }
      const data = await response.json();
      setRefresh(refresh =>!refresh);
    } catch (error) {
      console.error('Error:', error);
    }
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
          <SavedWork refresh={refresh} />
        </div>


        <div className="flex-container">
      <div className="file-upload-section">
          <h2> Upload file</h2>
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
