// src/components/FilePreview.jsx
import React from 'react';

const FilePreview = ({ file, type, onRemove }) => {
  if (!file) return null;

  return (
    <div className="file-preview-container">
      {type === "image" ? (
        <div className="position-relative d-inline-block">
          <img 
            src={file} 
            alt="Preview" 
            className="img-thumbnail" 
            style={{ maxWidth: "200px", maxHeight: "200px" }} 
          />
          <button
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0"
            onClick={onRemove}
            style={{ transform: "translate(50%, -50%)" }}
          >
            &times;
          </button>
        </div>
      ) : (
        <div className="position-relative d-inline-block">
          <video 
            src={file} 
            controls 
            className="img-thumbnail" 
            style={{ maxWidth: "200px", maxHeight: "200px" }} 
          />
          <button
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0"
            onClick={onRemove}
            style={{ transform: "translate(50%, -50%)" }}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default FilePreview;