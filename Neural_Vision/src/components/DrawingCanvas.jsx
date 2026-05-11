import React, { useState, useEffect } from "react";

const DrawingCanvas = ({ grid, setGrid, config, setConfig, onAddNoise}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredIndices, setHoveredIndices] = useState(new Set());

  // Handle mouse down/up globally to stop drawing even if mouse leaves the grid
  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Calculate all neighbor pixels (±1 in both directions)
  const getNeighborIndices = (index) => {
    const neighbors = new Set();
    const row = Math.floor(index / 28);
    const col = index % 28;

    // Loop through ±1 in both directions
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        // Check boundaries
        if (r >= 0 && r < 28 && c >= 0 && c < 28) {
          neighbors.add(r * 28 + c);
        }
      }
    }
    return neighbors;
  };

  const handleMouseEnter = (index) => {
    const neighbors = getNeighborIndices(index);
    setHoveredIndices(neighbors);
    if (isDrawing) {
      updatePixel(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndices(new Set());
  };

  const handleMouseDown = (index) => {
    setIsDrawing(true);
    updatePixel(index);
  };

  const updatePixel = (index) => {
    const newGrid = [...grid];
    newGrid[index] = 255; // Set to white
    setGrid(newGrid);
  };

  const clearCanvas = () => {
    setGrid(Array(784).fill(0));
  };

  return (
    <div className="canvas-wrapper">
      <div
        className="pixel-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(28, 1fr)",
          width: "280px",
          height: "280px",
          border: "2px solid #2486FF",
          backgroundColor: "#000",
          cursor: "crosshair",
          userSelect: "none",
          boxShadow: "0 0 15px rgba(36, 134, 255, 0.3)",
        }}
      >
        {grid.map((value, i) => (
          <div
            key={i}
            className="pixel"
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            data-hovered={hoveredIndices.has(i)}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: `rgb(${value}, ${value}, ${value})`,
              border: "0.1px solid rgba(255,255,255,0.05)",
              transition: "all 0.08s ease",
              filter: hoveredIndices.has(i)
                ? "brightness(1.3)"
                : "brightness(1)",
              boxShadow: hoveredIndices.has(i)
                ? "inset 0 0 3px rgba(36, 134, 255, 0.5)"
                : "none",
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>

      {/* Add Noise Control */}
      <div className="config-item">
        <label>Add Noise (Pixels): {config.noise}</label>
        <input
          type="range"
          name="noise"
          min="0"
          max="50"
          value={config.noise}
          onChange={handleChange}
          style={{ accentColor: "#00FFC2" }}
        />
      </div>

      <button
        style={{
          marginTop: "10px",
          marginBottom: "18px",
          background: "linear-gradient(to right, #00C2FF, #00FFC2)",
          color: "#06111f",
          border: "none",
          padding: "10px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "700",
          width: "100%",
        }}
        onClick={onAddNoise}
      >
        Add Noise to Canvas
      </button>

      {/* Clear Canvas Button */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <button
          onClick={clearCanvas}
          style={{
            marginTop: "20px",
            background: "linear-gradient(to right, #A456FA, #4A22E5)",
            color: "white",
            border: "none",
            padding: "10px 25px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 0 15px rgba(164, 86, 250, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
