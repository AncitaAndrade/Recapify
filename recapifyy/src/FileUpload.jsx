// FileUpload.jsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';

function FileUpload({ onSummaryGenerated }) {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setErrorMessage(''); 
  };

  const handleUpload = async () => {
    if (file) {
      const isValidFileType = checkFileType(file.name); 
      if (isValidFileType) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await fetch('http://recapify.us-east-2.elasticbeanstalk.com/summarize', {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) {
            throw new Error('Failed to upload file');
          }
          const summary = await response.json();
          onSummaryGenerated(summary);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      } else {
        displayErrorMessage(`Error: File '${file.name}' is not a supported file type. Allowed file types are: wav, mp3, aac, ogg, mpeg, amr, m4a, mp4, flac, pdf, docx, txt`); // Added
      }
    } else {
      displayErrorMessage('Error: No file selected'); // Added
    }
  };

  const checkFileType = (fileName) => {
    const allowedExtensions = ["wav", "mp3", "aac", "ogg", "mpeg", "amr", "m4a", "mp4", "flac", "pdf", "docx", "txt"];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const displayErrorMessage = (message) => { 
    setErrorMessage(message);
  };

  return (
    <div style={{  width: '600px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    border: '2px dashed #333',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    color: '#333',
    textAlign: 'center',
    maxWidth: '90%',}}>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default FileUpload;