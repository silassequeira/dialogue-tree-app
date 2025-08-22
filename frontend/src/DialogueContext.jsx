import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchNodesAPI,
  fetchConnectionsAPI,
  fetchGameElementsAPI,
  createNodeAPI,
  updateNodeAPI,
  deleteNodeAPI,
  createConnectionAPI,
  deleteConnectionAPI,
  updateGameElementsAPI,
  exportDataAPI,
  importDataAPI,
} from "./api";

const DialogueContext = createContext();

export const DialogueProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [gameElements, setGameElements] = useState({
    npcs: [],
    items: [],
    locations: [],
  });
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [nodesData, connectionsData, gameElementsData] =
          await Promise.all([
            fetchNodesAPI(),
            fetchConnectionsAPI(),
            fetchGameElementsAPI(),
          ]);

        setNodes(nodesData);
        setConnections(connectionsData);
        setGameElements(gameElementsData[0] || { npcs: [], items: [], locations: [] });

        // Set node counter to highest ID
        if (nodesData.length > 0) {
          setNodeCounter(Math.max(...nodesData.map((n) => n.id)));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Create a new node
  const createNode = async (type) => {
    try {
      const newNodeId = nodeCounter + 1;
      const newNode = {
        id: newNodeId,
        type: type,
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
        text: type === "npc" ? "NPC says something..." : "Player choice...",
        choices: type === "player" ? ["Choice 1"] : [],
        associatedNpc: "",
        conditions: {
          requiredItems: [],
          requiredLocation: "",
          custom: "",
        },
        consequences: {
          giveItems: [],
          removeItems: [],
          changeLocation: "",
          custom: "",
        },
      };

      const createdNode = await createNodeAPI(newNode);

      setNodes([...nodes, createdNode]);
      setNodeCounter(newNodeId);
    } catch (error) {
      console.error("Error creating node:", error);
    }
  };

  // Update an existing node
  const updateNode = async (nodeId, nodeData) => {
    try {
      const updatedNode = await updateNodeAPI(nodeId, nodeData);

      setNodes(
        nodes.map((node) =>
          node.id === nodeId ? { ...node, ...nodeData } : node
        )
      );
    } catch (error) {
      console.error("Error updating node:", error);
    }
  };

  // Delete a node
  const deleteNode = async (nodeId) => {
    try {
      await deleteNodeAPI(nodeId);

      // Remove node
      setNodes(nodes.filter((node) => node.id !== nodeId));

      // Remove associated connections
      const filteredConnections = connections.filter(
        (conn) => conn.from !== nodeId && conn.to !== nodeId
      );

      setConnections(filteredConnections);

      // Delete connections from API
      const connectionsToDelete = connections.filter(
        (conn) => conn.from === nodeId || conn.to === nodeId
      );

      for (const conn of connectionsToDelete) {
        await deleteConnectionAPI(conn.id);
      }
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  // Create a connection between nodes
  const createConnection = async (fromNodeId, toNodeId) => {
    try {
      const newConnection = {
        from: fromNodeId,
        to: toNodeId,
      };

      const createdConnection = await createConnectionAPI(newConnection);

      setConnections([...connections, createdConnection]);
    } catch (error) {
      console.error("Error creating connection:", error);
    }
  };

  // Delete a connection
  const deleteConnection = async (connectionId) => {
    try {
      await deleteConnectionAPI(connectionId);

      setConnections(connections.filter((conn) => conn.id !== connectionId));
    } catch (error) {
      console.error("Error deleting connection:", error);
    }
  };

  // Add game element
  const addGameElement = async (type, element) => {
    try {
      if (!gameElements[type].includes(element)) {
        const updatedElements = {
          ...gameElements,
          [type]: [...gameElements[type], element],
        };

        await updateGameElementsAPI(updatedElements);

        setGameElements(updatedElements);
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
    }
  };

  // Remove game element
  const removeGameElement = async (type, element) => {
    try {
      const updatedElements = {
        ...gameElements,
        [type]: gameElements[type].filter((item) => item !== element),
      };

      await updateGameElementsAPI(updatedElements);

      setGameElements(updatedElements);
    } catch (error) {
      console.error(`Error removing ${type}:`, error);
    }
  };

  // Export data
  const exportData = async () => {
    try {
      const blob = await exportDataAPI();

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dialogue-tree.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  // Import data
  const importData = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await importDataAPI(formData);

      // Update state with imported data
      setNodes(data.nodes || []);
      setConnections(data.connections || []);
      setGameElements(
        data.gameElements || { npcs: [], items: [], locations: [] }
      );

      // Update node counter
      if (data.nodes && data.nodes.length > 0) {
        setNodeCounter(Math.max(...data.nodes.map((n) => n.id)));
      } else {
        setNodeCounter(0);
      }

      alert("Data imported successfully!");
    } catch (error) {
      console.error("Error importing data:", error);
      alert(`Import failed: ${error.message}`);
    }
  };

  // Clear all data
  const clearAll = async (confirmFirst = true) => {
    if (
      confirmFirst &&
      !window.confirm("Are you sure you want to clear all data?")
    ) {
      return;
    }

    try {
      // Clear backend data
      await Promise.all([
        updateGameElementsAPI({ npcs: [], items: [], locations: [] }),
        nodes.map((node) => deleteNodeAPI(node.id)),
        connections.map((conn) => deleteConnectionAPI(conn.id)),
      ]);

      // Clear state
      setNodes([]);
      setConnections([]);
      setGameElements({ npcs: [], items: [], locations: [] });
      setNodeCounter(0);
      setCurrentNodeId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  // Save project to local storage as backup
  const saveProject = () => {
    try {
      const projectData = {
        nodes,
        connections,
        gameElements,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("dialogueTreeProject", JSON.stringify(projectData));
      alert("Project saved locally!");
    } catch (error) {
      console.error("Error saving project:", error);
      alert(`Save failed: ${error.message}`);
    }
  };

  // Load project from local storage
  const loadProject = () => {
    try {
      const savedProject = localStorage.getItem("dialogueTreeProject");
      if (!savedProject) {
        alert("No saved project found.");
        return;
      }

      const projectData = JSON.parse(savedProject);
      setNodes(projectData.nodes || []);
      setConnections(projectData.connections || []);
      setGameElements(
        projectData.gameElements || { npcs: [], items: [], locations: [] }
      );

      if (projectData.nodes && projectData.nodes.length > 0) {
        setNodeCounter(Math.max(...projectData.nodes.map((n) => n.id)));
      }

      alert(
        `Project loaded from ${new Date(
          projectData.timestamp
        ).toLocaleString()}`
      );
    } catch (error) {
      console.error("Error loading project:", error);
      alert(`Load failed: ${error.message}`);
    }
  };

  const contextValue = {
    // State
    nodes,
    setNodes,
    connections,
    setConnections,
    gameElements,
    setGameElements,
    currentNodeId,
    setCurrentNodeId,
    isModalOpen,
    setIsModalOpen,
    nodeCounter,
    setNodeCounter,
    zoomLevel,
    setZoomLevel,
    panOffset,
    setPanOffset,
    isConnecting,
    setIsConnecting,
    connectionStart,
    setConnectionStart,

    // Methods
    createNode,
    updateNode,
    deleteNode,
    createConnection,
    deleteConnection,
    addGameElement,
    removeGameElement,
    exportData,
    importData,
    clearAll,
    saveProject,
    loadProject,
  };

  return (
    <DialogueContext.Provider value={contextValue}>
      {children}
    </DialogueContext.Provider>
  );
};

export const useDialogueContext = () => {
  const context = useContext(DialogueContext);
  if (!context) {
    throw new Error(
      "useDialogueContext must be used within a DialogueProvider"
    );
  }
  return context;
};
