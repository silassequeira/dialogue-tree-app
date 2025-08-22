/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { fetchNodes, fetchConnections, fetchGameElements } from "./api";

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

  useEffect(() => {
    // Load data on component mount
    const loadInitialData = async () => {
      try {
        const nodesData = await fetchNodes();
        const connectionsData = await fetchConnections();
        const gameElementsData = await fetchGameElements();

        setNodes(nodesData);
        setConnections(connectionsData);
        setGameElements(gameElementsData);

        if (nodesData.length > 0) {
          setNodeCounter(Math.max(...nodesData.map((n) => n.id)));
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Add methods for managing nodes, connections, etc.

  const value = {
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
    // Node management
    addNode: (newNode) => {
      setNodes((prevNodes) => [...prevNodes, newNode]);
      console.log("Add Node:", newNode);
    },
    updateNode: (id, updatedData) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => (node.id === id ? { ...node, ...updatedData } : node))
      );
      console.log("Update Node:", id, updatedData);
    },
    deleteNode: (id) => {
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
      console.log("Delete Node:", id);
    },

    // Connection management
    addConnection: (newConnection) => {
      setConnections((prevConnections) => [...prevConnections, newConnection]);
      console.log("Add Connection:", newConnection);
    },
    updateConnection: (id, updatedData) => {
      setConnections((prevConnections) =>
        prevConnections.map((conn) => (conn.id === id ? { ...conn, ...updatedData } : conn))
      );
      console.log("Update Connection:", id, updatedData);
    },
    deleteConnection: (id) => {
      setConnections((prevConnections) => prevConnections.filter((conn) => conn.id !== id));
      console.log("Delete Connection:", id);
    },

    // Game Element management
    addGameElement: (type, newElement) => {
      setGameElements((prevElements) => ({
        ...prevElements,
        [type]: [...prevElements[type], newElement],
      }));
      console.log("Add Game Element:", type, newElement);
    },
    updateGameElement: (type, id, updatedData) => {
      setGameElements((prevElements) => ({
        ...prevElements,
        [type]: prevElements[type].map((el) => (el.id === id ? { ...el, ...updatedData } : el)),
      }));
      console.log("Update Game Element:", type, id, updatedData);
    },
    deleteGameElement: (type, id) => {
      setGameElements((prevElements) => ({
        ...prevElements,
        [type]: prevElements[type].filter((el) => el.id !== id),
      }));
      console.log("Delete Game Element:", type, id);
    },
  };

  return (
    <DialogueContext.Provider value={value}>
      {children}
    </DialogueContext.Provider>
  );
};

export const useDialogue = () => useContext(DialogueContext);
