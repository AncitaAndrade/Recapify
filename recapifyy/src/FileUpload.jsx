// FileUpload.js
import React from 'react';

function FileUpload() {
  return (
    <div className="file-upload-container">
      <input type="file" className="file-input" />
      <button className="upload-button">Upload</button>
    </div>
  );
}

export default FileUpload;
