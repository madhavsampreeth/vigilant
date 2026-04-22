import React from 'react';
import UploadPanel from '../components/UploadPanel.jsx';

const Upload = () => (
  <>
    <h1 className="page-title">UPLOAD VIDEO</h1>
    <p className="page-subtitle">
       Upload original video with a name and store fingerprint
    </p>

    <UploadPanel />
  </>
);

export default Upload;