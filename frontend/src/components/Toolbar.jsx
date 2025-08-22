import React from 'react';
import './Toolbar.css'; // Assuming you'll have a Toolbar.css

const Toolbar = () => {
  const handleSave = () => {
    console.log("Save clicked");
    // Implement save logic here
  };

  const handleLoad = () => {
    console.log("Load clicked");
    // Implement load logic here
  };

  const handleExport = () => {
    console.log("Export clicked");
    // Implement export logic here
  };

  const handleImport = () => {
    console.log("Import clicked");
    // Implement import logic here
  };

  return (
    <div className="toolbar">
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad}>Load</button>
      <button onClick={handleExport}>Export</button>
      <button onClick={handleImport}>Import</button>
    </div>
  );
};

export default Toolbar;