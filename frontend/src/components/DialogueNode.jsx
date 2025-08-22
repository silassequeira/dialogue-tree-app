import { useRef, useEffect } from "react";
import { useDialogue } from "../DialogueContext";
import "./DialogueNode.css";

const DialogueNode = ({ node }) => {
  const nodeRef = useRef(null);
  const {
    setCurrentNodeId,
    setIsModalOpen,
    isConnecting,
    setIsConnecting,
    connectionStart,
    setConnectionStart,
    connections,
    addConnection, // Added addConnection
    updateNode, // Added updateNode
  } = useDialogue();

  // Make node draggable
  useEffect(() => {
    const nodeElement = nodeRef.current;
    if (!nodeElement) return;

    let isDragging = false;
    let offset = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      if (
        e.target.classList.contains("connection-point") ||
        e.target.tagName === "BUTTON"
      )
        return;

      isDragging = true;
      const rect = nodeElement.getBoundingClientRect();
      offset.x = e.clientX - rect.left;
      offset.y = e.clientY - rect.top;
      nodeElement.style.zIndex = 1000;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const canvasRect = document
        .getElementById("canvas")
        .getBoundingClientRect();
      const x = e.clientX - canvasRect.left - offset.x;
      const y = e.clientY - canvasRect.top - offset.y;

      nodeElement.style.left = `${x}px`;
      nodeElement.style.top = `${y}px`;

      // Update node position in the nodes array
      // This would ideally be in a state update function
      node.x = x;
      node.y = y;
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        nodeElement.style.zIndex = "";
      }
    };

    nodeElement.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      nodeElement.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [node]);

  const handleEdit = () => {
    setCurrentNodeId(node.id);
    setIsModalOpen(true);
  };

  const startConnection = (type) => {
    if (!isConnecting) {
      setIsConnecting(true);
      setConnectionStart({ nodeId: node.id, type });
    } else {
      // Complete connection
      if (connectionStart.nodeId !== node.id) {
        const connection = {
          from:
            connectionStart.type === "output"
              ? connectionStart.nodeId
              : node.id,
          to:
            connectionStart.type === "output"
              ? node.id
              : connectionStart.nodeId,
        };
        addConnection(connection);
      }
      setIsConnecting(false);
      setConnectionStart(null);
    }
  };

  // Render choices, conditions, consequences
  let choicesHtml = "";
  if (node.type === "player" && node.choices.length > 0) {
    choicesHtml = (
      <div className="choices-container">
        {node.choices.map((choice, index) => (
          <div key={index} className="choice-item">
            {choice}
          </div>
        ))}
      </div>
    );
  }

  let conditionsHtml = null;
  if (
    node.conditions.requiredItems.length > 0 ||
    node.conditions.requiredLocation ||
    node.conditions.custom
  ) {
    conditionsHtml = (
      <div className="node-conditions">
        Conditions:
        {node.conditions.requiredItems.length > 0 &&
          `Items: ${node.conditions.requiredItems.join(", ")} `}
        {node.conditions.requiredLocation &&
          `Location: ${node.conditions.requiredLocation} `}
        {node.conditions.custom && `Custom: ${node.conditions.custom}`}
      </div>
    );
  }

  let consequencesHtml = null;
  if (
    node.consequences.giveItems.length > 0 ||
    node.consequences.removeItems.length > 0 ||
    node.consequences.changeLocation ||
    node.consequences.custom
  ) {
    consequencesHtml = (
      <div className="node-consequences">
        Actions:
        {node.consequences.giveItems.length > 0 &&
          `Give: ${node.consequences.giveItems.join(", ")} `}
        {node.consequences.removeItems.length > 0 &&
          `Remove: ${node.consequences.removeItems.join(", ")} `}
        {node.consequences.changeLocation &&
          `Go to: ${node.consequences.changeLocation} `}
        {node.consequences.custom && `Custom: ${node.consequences.custom}`}
      </div>
    );
  }

  return (
    <div
      ref={nodeRef}
      className={`dialogue-node ${node.type}`}
      style={{ left: node.x + "px", top: node.y + "px" }}
      data-node-id={node.id}
    >
      <div className="node-header">
        <span className={`node-type ${node.type}`}>
          {node.type.toUpperCase()}
        </span>
        <button
          className="btn"
          onClick={handleEdit}
          style={{ padding: "5px 8px", fontSize: "11px" }}
        >
          Edit
        </button>
      </div>

      <div className="node-content">
        <div className="node-text">{node.text}</div>
        {conditionsHtml}
        {consequencesHtml}
        {node.associatedNpc && (
          <div className="element-tag">NPC: {node.associatedNpc}</div>
        )}
        {choicesHtml}
      </div>

      <div
        className="connection-point input-point"
        onClick={() => startConnection("input")}
      ></div>
      <div
        className="connection-point output-point"
        onClick={() => startConnection("output")}
      ></div>
    </div>
  );
};

export default DialogueNode;
