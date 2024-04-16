// FileUpload.jsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';

function FileUpload({ onSummaryGenerated }) {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // Added

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setErrorMessage(''); // Added
  };

  const handleUpload = async () => {
    if (file) {
      const isValidFileType = checkFileType(file.name); // Added
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

  const checkFileType = (fileName) => { // Moved from outside the component
    const allowedExtensions = ["wav", "mp3", "aac", "ogg", "mpeg", "amr", "m4a", "mp4", "flac", "pdf", "docx", "txt"];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const displayErrorMessage = (message) => { // Added
    setErrorMessage(message);
  };

  return (
    <div style={{width:'600px'}}>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
      {errorMessage && <p>{errorMessage}</p>} {/* Added */}
    </div>
  );
}

export default FileUpload;