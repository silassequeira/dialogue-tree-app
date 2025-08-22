import { useRef, useEffect, useState } from "react";
import { useDialogue } from "../DialogueContext";
import DialogueNode from "./DialogueNode";
import Toolbar from "./Toolbar";
import "./Canvas.css";

const Canvas = () => {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const { nodes, connections, panOffset, setPanOffset, zoomLevel } =
    useDialogue();

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
        const toY = toNode.y + 60; // Middle of toNode

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
  }, [connections, nodes]);

  return (
    <>
      <Toolbar />
      <div
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
    </>
  );
};

export default Canvas;
