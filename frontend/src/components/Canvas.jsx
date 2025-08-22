import { useRef, useEffect, useState } from "react";
import { useDialogueContext } from "../DialogueContext";
import DialogueNode from "./DialogueNode";
import Toolbar from "./Toolbar";
import "./Canvas.css";

const Canvas = () => {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [tempConnection, setTempConnection] = useState(null);

  const {
    nodes,
    connections,
    panOffset,
    setPanOffset,
    zoomLevel,
    isConnecting,
    connectionStart,
    isLoading,
  } = useDialogueContext();

  // Handle panning
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isPanning) return;

      setPanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, startPan, setPanOffset]);

  // Handle canvas mousedown for panning
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setIsPanning(true);
      setStartPan({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      });
    }
  };

  // Track mouse for temporary connection line
  useEffect(() => {
    if (!isConnecting || !connectionStart) return;

    const handleMouseMove = (e) => {
      const canvasRect = document
        .getElementById("canvas")
        .getBoundingClientRect();

      // Calculate start point based on the connection start node
      const startNode = nodes.find((n) => n.id === connectionStart.nodeId);
      if (!startNode) return;

      let startX, startY;
      if (connectionStart.type === "output") {
        startX = startNode.x + 250; // Right edge
        startY = startNode.y + 125; // Middle
      } else {
        startX = startNode.x; // Left edge
        startY = startNode.y + 125; // Middle
      }

      // End point follows the mouse
      const endX = (e.clientX - canvasRect.left - panOffset.x) / zoomLevel;
      const endY = (e.clientY - canvasRect.top - panOffset.y) / zoomLevel;

      setTempConnection({ startX, startY, endX, endY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isConnecting, connectionStart, nodes, panOffset, zoomLevel]);

  // Update connections
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear svg
    svgRef.current.innerHTML = "";

    // Draw connections
    connections.forEach((conn) => {
      const fromNode = nodes.find((n) => n.id === conn.from);
      const toNode = nodes.find((n) => n.id === conn.to);

      if (fromNode && toNode) {
        const fromX = fromNode.x + 250; // Right edge of fromNode
        const fromY = fromNode.y + 125; // Middle of fromNode
        const toX = toNode.x; // Left edge of toNode
        const toY = toNode.y + 125; // Middle of toNode

        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", fromX);
        line.setAttribute("y1", fromY);
        line.setAttribute("x2", toX);
        line.setAttribute("y2", toY);
        line.setAttribute("stroke", "rgba(255, 255, 255, 0.6)");
        line.setAttribute("stroke-width", "2");
        svgRef.current.appendChild(line);
      }
    });

    // Draw temporary connection line if connecting
    if (tempConnection) {
      const { startX, startY, endX, endY } = tempConnection;
      const tempLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      tempLine.setAttribute("x1", startX);
      tempLine.setAttribute("y1", startY);
      tempLine.setAttribute("x2", endX);
      tempLine.setAttribute("y2", endY);
      tempLine.classList.add("temp-connection");
      svgRef.current.appendChild(tempLine);
    }
  }, [connections, nodes, tempConnection]);

  // Render empty state if no nodes
  if (!isLoading && nodes.length === 0) {
    return (
      <div className="canvas-container">
        <Toolbar />
        <div
          className="canvas"
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          }}
        >
          <div className="canvas-empty">
            <h3>No Dialogue Nodes Yet</h3>
            <p>
              Start creating your dialogue tree by adding NPC dialogue or player
              choice nodes from the sidebar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="canvas-container">
        <div className="canvas-loader">
          <div className="canvas-loader-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-container">
      <Toolbar />
      <div
        id="canvas"
        className="canvas"
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
        }}
      >
        <svg ref={svgRef} id="connectionSvg"></svg>
        {nodes.map((node) => (
          <DialogueNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
