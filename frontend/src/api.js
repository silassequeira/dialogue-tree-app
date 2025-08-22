const API_URL = "http://localhost:5000/api";

// Node CRUD operations
export const fetchNodes = async () => {
  const response = await fetch(`${API_URL}/nodes`);
  if (!response.ok) throw new Error("Failed to fetch nodes");
  return response.json();
};

export const createNode = async (nodeData) => {
  const response = await fetch(`${API_URL}/nodes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nodeData),
  });
  if (!response.ok) throw new Error("Failed to create node");
  return response.json();
};

export const updateNode = async (id, nodeData) => {
  const response = await fetch(`${API_URL}/nodes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nodeData),
  });
  if (!response.ok) throw new Error("Failed to update node");
  return response.json();
};

export const deleteNode = async (id) => {
  const response = await fetch(`${API_URL}/nodes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete node");
  return response.json();
};

// Similar implementations for connections and game elements
export const fetchConnections = async () => {
  const response = await fetch(`${API_URL}/connections`);
  if (!response.ok) throw new Error("Failed to fetch connections");
  return response.json();
};

export const fetchGameElements = async () => {
  const response = await fetch(`${API_URL}/gameElements`);
  if (!response.ok) throw new Error("Failed to fetch game elements");
  return response.json();
};

// Export/Import
export const exportData = async () => {
  const response = await fetch(`${API_URL}/export`);
  if (!response.ok) throw new Error("Failed to export data");
  return response.blob();
};

export const importData = async (formData) => {
  const response = await fetch(`${API_URL}/import`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to import data");
  return response.json();
};
