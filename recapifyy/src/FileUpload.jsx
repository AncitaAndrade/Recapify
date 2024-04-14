// FileUpload.jsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';

function FileUpload({ onSummaryGenerated }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
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
        onSummaryGenerated(summaryData.summary); 
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default FileUpload;
