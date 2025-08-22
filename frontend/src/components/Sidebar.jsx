import React from 'react';
import { useDialogue } from '../DialogueContext';
import './Sidebar.css'; // Assuming you'll have a Sidebar.css

const Sidebar = () => {
  const { addNode, setNodeCounter, nodeCounter } = useDialogue();

  const handleAddNode = () => {
    const newNode = {
      id: nodeCounter + 1,
      type: "dialogue",
      x: 50,
      y: 50,
      text: "New Dialogue Node",
      choices: [],
      associatedNpc: "",
      conditions: { requiredItems: [], requiredLocation: "", custom: "" },
      consequences: { giveItems: [], removeItems: [], changeLocation: "", custom: "" },
    };
    addNode(newNode);
    setNodeCounter(nodeCounter + 1);
  };

  return (
    <div className="sidebar">
      <h3>Tools</h3>
      <button onClick={handleAddNode}>Add New Node</button>
      {/* Add more tools here */}
    </div>
  );
};

export default Sidebar;