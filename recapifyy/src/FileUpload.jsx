// FileUpload.jsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

function FileUpload({ onSummaryGenerated }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [progress, setProgress] = useState(0);
  

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
        setUploading(true); 

        try {
          const response = await fetch('http://recapify.us-east-2.elasticbeanstalk.com/summarize', {
            method: 'POST',
            body: formData,
            onUploadProgress: (progressEvent) => {
              const progressPercent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setProgress(progressPercent); 
            },
          });
          if (!response.ok) {
            throw new Error('Failed to upload file');
          }
          const summary = await response.json();
          onSummaryGenerated(summary);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
        finally {
          setUploading(false); 
          setProgress(0);
        }

      } else {
        displayErrorMessage(`Error: File '${file.name}' is not a supported file type. Allowed file types are: wav, mp3, aac, ogg, mpeg, amr, m4a, mp4, flac, pdf, docx, txt`); // Added
      } 
      
    }
    
    else {
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
    <div className="file-upload-container">
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
      {uploading && <CircularProgress />}
      <LinearProgress variant="determinate" value={progress} />
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default FileUpload;