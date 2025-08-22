import React from "react";
import { useDialogueContext } from "../DialogueContext";
import "./Toolbar.css";

const Toolbar = () => {
  const {
    zoomLevel,
    setZoomLevel,
    setPanOffset,
    exportDialogueTree,
    importDialogueTree,
    saveProject,
    loadProject,
  } = useDialogueContext();

  const handleSave = () => {
    saveProject();
  };

  const handleLoad = () => {
    loadProject();
  };

  const handleExport = () => {
    exportDialogueTree();
  };

  const handleImport = () => {
    // Create hidden file input
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        importDialogueTree(file);
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel / 1.2, 0.3));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={handleSave}>
          Save
        </button>
        <button className="toolbar-button" onClick={handleLoad}>
          Load
        </button>
      </div>

      <div className="toolbar-group">
        <button className="toolbar-button" onClick={handleExport}>
          Export
        </button>
        <button className="toolbar-button" onClick={handleImport}>
          Import
        </button>
      </div>

      <div className="toolbar-group">
        <button className="toolbar-button zoom" onClick={handleZoomIn}>
          🔍+
        </button>
        <button className="toolbar-button zoom" onClick={handleZoomOut}>
          🔍-
        </button>
        <button className="toolbar-button" onClick={handleResetZoom}>
          Reset View
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
