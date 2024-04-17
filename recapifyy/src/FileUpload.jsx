// FileUpload.jsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

function FileUpload({ onSummaryGenerated }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [open, setOpen] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setErrorMessage(''); 
  };
  const handleClose = () => {
    setOpen(false);
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
            body: formData
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
        }

      } else {
        displayErrorMessage(`Error: File '${file.name}' is not a supported file type.`); 
      }
    } else {
      displayErrorMessage('Error: No file selected');
    }
    
  };

  const checkFileType = (fileName) => {
    const allowedExtensions = ["wav", "mp3", "aac", "ogg", "mpeg", "amr", "m4a", "mp4", "flac", "pdf", "docx", "txt"];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const displayErrorMessage = (message) => { 
    setErrorMessage(message);
    if (message) {
      setOpen(true);
    }
  };

  return (
    <div className="file-upload-container">
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
       <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={errorMessage }
          key={'top' + 'center'}
        />       
      {uploading && <CircularProgress style={{'color': '#a56b65'}}/>}
    </div>
  );
}

export default FileUpload;