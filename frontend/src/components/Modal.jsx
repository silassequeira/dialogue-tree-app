import React, { useState, useEffect } from "react";
import { useDialogueContext } from "../DialogueContext";
import "./Modal.css";

const NodeModal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    currentNodeId,
    nodes,
    updateNode,
    deleteNode,
    gameElements,
  } = useDialogueContext();

  const [activeTab, setActiveTab] = useState("content");
  const [nodeData, setNodeData] = useState({
    text: "",
    choices: [],
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
  });

  useEffect(() => {
    if (currentNodeId) {
      const node = nodes.find((n) => n.id === currentNodeId);
      if (node) {
        setNodeData({
          text: node.text || "",
          choices: [...(node.choices || [])],
          associatedNpc: node.associatedNpc || "",
          conditions: {
            requiredItems: [...(node.conditions?.requiredItems || [])],
            requiredLocation: node.conditions?.requiredLocation || "",
            custom: node.conditions?.custom || "",
          },
          consequences: {
            giveItems: [...(node.consequences?.giveItems || [])],
            removeItems: [...(node.consequences?.removeItems || [])],
            changeLocation: node.consequences?.changeLocation || "",
            custom: node.consequences?.custom || "",
          },
        });
      }
    }
  }, [currentNodeId, nodes]);

  const handleSave = () => {
    if (currentNodeId) {
      updateNode(currentNodeId, nodeData);
      handleClose();
    }
  };

  const handleDelete = () => {
    if (
      currentNodeId &&
      window.confirm("Are you sure you want to delete this node?")
    ) {
      deleteNode(currentNodeId);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setActiveTab("content");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNodeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConditionChange = (e) => {
    const { name, value } = e.target;
    setNodeData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [name]: value,
      },
    }));
  };

  const handleConsequenceChange = (e) => {
    const { name, value } = e.target;
    setNodeData((prev) => ({
      ...prev,
      consequences: {
        ...prev.consequences,
        [name]: value,
      },
    }));
  };

  const handleAddChoice = () => {
    setNodeData((prev) => ({
      ...prev,
      choices: [...prev.choices, "New choice"],
    }));
  };

  const handleUpdateChoice = (index, value) => {
    const updatedChoices = [...nodeData.choices];
    updatedChoices[index] = value;
    setNodeData((prev) => ({
      ...prev,
      choices: updatedChoices,
    }));
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = nodeData.choices.filter((_, i) => i !== index);
    setNodeData((prev) => ({
      ...prev,
      choices: updatedChoices,
    }));
  };

  const handleToggleItem = (itemType, item, isChecked) => {
    if (itemType === "requiredItems") {
      setNodeData((prev) => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          requiredItems: isChecked
            ? [...prev.conditions.requiredItems, item]
            : prev.conditions.requiredItems.filter((i) => i !== item),
        },
      }));
    } else if (itemType === "giveItems") {
      setNodeData((prev) => ({
        ...prev,
        consequences: {
          ...prev.consequences,
          giveItems: isChecked
            ? [...prev.consequences.giveItems, item]
            : prev.consequences.giveItems.filter((i) => i !== item),
        },
      }));
    } else if (itemType === "removeItems") {
      setNodeData((prev) => ({
        ...prev,
        consequences: {
          ...prev.consequences,
          removeItems: isChecked
            ? [...prev.consequences.removeItems, item]
            : prev.consequences.removeItems.filter((i) => i !== item),
        },
      }));
    }
  };

  const currentNode = nodes.find((n) => n.id === currentNodeId);
  const nodeType = currentNode?.type || "";

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {nodeType === "npc" ? "Edit NPC Dialogue" : "Edit Player Choice"}
          </h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-button ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            Content
          </button>
          <button
            className={`tab-button ${
              activeTab === "conditions" ? "active" : ""
            }`}
            onClick={() => setActiveTab("conditions")}
          >
            Conditions
          </button>
          <button
            className={`tab-button ${
              activeTab === "consequences" ? "active" : ""
            }`}
            onClick={() => setActiveTab("consequences")}
          >
            Actions
          </button>
        </div>

        <div className="modal-body">
          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="tab-content">
              <div className="form-group">
                <label>Dialogue Text:</label>
                <textarea
                  name="text"
                  value={nodeData.text}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Enter dialogue text..."
                />
              </div>

              {nodeType === "player" && (
                <div className="form-group">
                  <label>Player Choices:</label>
                  <div className="choices-list">
                    {nodeData.choices.map((choice, index) => (
                      <div key={index} className="choice-item">
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) =>
                            handleUpdateChoice(index, e.target.value)
                          }
                        />
                        <button
                          className="remove-button"
                          onClick={() => handleRemoveChoice(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="add-button" onClick={handleAddChoice}>
                    Add Choice
                  </button>
                </div>
              )}

              <div className="form-group">
                <label>Associated NPC:</label>
                <select
                  name="associatedNpc"
                  value={nodeData.associatedNpc}
                  onChange={handleInputChange}
                >
                  <option value="">Select NPC (optional)</option>
                  {gameElements.npcs.map((npc) => (
                    <option key={npc} value={npc}>
                      {npc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Conditions Tab */}
          {activeTab === "conditions" && (
            <div className="tab-content">
              <div className="form-group">
                <label>Required Items:</label>
                <div className="items-checkboxes">
                  {gameElements.items.map((item) => (
                    <div key={item} className="checkbox-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={nodeData.conditions.requiredItems.includes(
                            item
                          )}
                          onChange={(e) =>
                            handleToggleItem(
                              "requiredItems",
                              item,
                              e.target.checked
                            )
                          }
                        />
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Required Location:</label>
                <select
                  name="requiredLocation"
                  value={nodeData.conditions.requiredLocation}
                  onChange={handleConditionChange}
                >
                  <option value="">Any location</option>
                  {gameElements.locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Custom Condition:</label>
                <input
                  type="text"
                  name="custom"
                  value={nodeData.conditions.custom}
                  onChange={handleConditionChange}
                  placeholder="e.g., player.level >= 5"
                />
              </div>
            </div>
          )}

          {/* Consequences Tab */}
          {activeTab === "consequences" && (
            <div className="tab-content">
              <div className="form-group">
                <label>Give Items:</label>
                <div className="items-checkboxes">
                  {gameElements.items.map((item) => (
                    <div key={item} className="checkbox-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={nodeData.consequences.giveItems.includes(
                            item
                          )}
                          onChange={(e) =>
                            handleToggleItem(
                              "giveItems",
                              item,
                              e.target.checked
                            )
                          }
                        />
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Remove Items:</label>
                <div className="items-checkboxes">
                  {gameElements.items.map((item) => (
                    <div key={item} className="checkbox-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={nodeData.consequences.removeItems.includes(
                            item
                          )}
                          onChange={(e) =>
                            handleToggleItem(
                              "removeItems",
                              item,
                              e.target.checked
                            )
                          }
                        />
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Change Location To:</label>
                <select
                  name="changeLocation"
                  value={nodeData.consequences.changeLocation}
                  onChange={handleConsequenceChange}
                >
                  <option value="">No change</option>
                  {gameElements.locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Custom Action:</label>
                <input
                  type="text"
                  name="custom"
                  value={nodeData.consequences.custom}
                  onChange={handleConsequenceChange}
                  placeholder="e.g., player.experience += 100"
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete Node
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
