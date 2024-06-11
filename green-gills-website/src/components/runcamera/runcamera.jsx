import React, { useState } from 'react';

const RunCamera = () => {
  const [showIframe, setShowIframe] = useState(false);

  const handleCameraToggle = () => {
    setShowIframe(!showIframe);
  };

  return (
    <div>
      <button onClick={handleCameraToggle}>
        {showIframe ? 'Hide Camera' : 'Show Camera'}
      </button>
      {showIframe && (
        <iframe
          src="http://192.168.0.235:8889/cam1/"
          style={{ width: '100%', height: '500px', border: 'none', marginTop: '10px' }}
          title="Camera Feed"
        ></iframe>
      )}
    </div>
  );
};

export default RunCamera;
