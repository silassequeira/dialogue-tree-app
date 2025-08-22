import React from "react";
import { useDialogueContext } from "../DialogueContext";
import "./Sidebar.css"; // Assuming you'll have a Sidebar.css

const Sidebar = () => {
  const { createNode, setNodeCounter, nodeCounter } = useDialogueContext();

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
      consequences: {
        giveItems: [],
        removeItems: [],
        changeLocation: "",
        custom: "",
      },
    };
    createNode("dialogue");
    setNodeCounter(nodeCounter + 1);
  };

  return (
    <div className="sidebar">
      <button onClick={handleAddNode} className="sidebar-button">
        Add New Node
      </button>
      {/* Add more tools here */}
    </div>
  );
};

export default Sidebar;
