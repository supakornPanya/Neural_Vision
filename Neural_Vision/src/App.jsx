import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import DrawingCanvas from "./components/DrawingCanvas";
import ConfigPanel from "./components/ConfigPanel";
import NeuralVisionCanvas from "./components/NeuralVisionCanvas";
import "./App.css";

function App() {
  // --- STATE MANAGEMENT ---
  const [grid, setGrid] = useState(Array(784).fill(0)); // 28x28 flattened
  const [model, setModel] = useState(null);
  const initialConfig = {
    layers: 1, // 1 to 20
    activation: "relu", // relu, sigmoid, tanh
    noise: 0,
  };
  const [config, setConfig] = useState({
    ...initialConfig,
  });

  const handleAddNoise = () => {
    const noiseCount = Number(config.noise) || 0;

    if (noiseCount <= 0) {
      console.log("Noise count is 0, nothing to add.");
      return;
    }

    setGrid((prevGrid) => {
      const nextGrid = [...prevGrid];
      const availableIndices = nextGrid
        .map((value, index) => (value === 0 ? index : null))
        .filter((index) => index !== null);

      const targetNoiseCount = Math.min(noiseCount, availableIndices.length);
      let addedNoise = 0;

      while (addedNoise < targetNoiseCount && availableIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const selectedIndex = availableIndices.splice(randomIndex, 1)[0];

        if (nextGrid[selectedIndex] === 0) {
          nextGrid[selectedIndex] = 255;
          addedNoise += 1;
        }
      }

      console.log(`Added ${addedNoise} noise pixels to the drawing grid.`);
      return nextGrid;
    });
  };

  const onStartPrediction = () => {
    console.log("Starting prediction with the following data:");
    console.log("Config data:", config);
    console.log("28x28 grid data:", grid);
    console.log("Data passed to NeuralVisionCanvas:", {
      grid,
      config,
    });
  };

  return (
    <div className="app-container">
      <div className="m-8 text-center">
        <h1 className="text-4xl font-bold">CIS: Neural Vision</h1>
      </div>
      {/* ROW 1: INPUT & CONFIG */}
      <div className="row row-1 m-8">
        {/* Drawing Section */}
        <div className="col col-drawing">
          <div className="card-header">
            <div className="status-dot"></div>
            <h3>1. Input Matrix</h3>
            <span className="dimension-tag">28x28 Pixels</span>
          </div>
          <div className="canvas-container">
            <DrawingCanvas
              grid={grid}
              setGrid={setGrid}
              config={config}
              setConfig={setConfig}
              onAddNoise={handleAddNoise}
            />
          </div>
        </div>

        {/* Config Section */}
        <div className="col col-config">
          <div className="card-header">
            <div className="status-dot"></div>
            <h3>2. Configuration & Prediction</h3>
          </div>
          <ConfigPanel
            config={config}
            setConfig={setConfig}
            onStartPrediction={onStartPrediction}
          />
        </div>
      </div>

      {/* ROW 2: VISUALIZATION */}
      <div className="col col-full">
        <div className="card-header">
          <div className="status-dot"></div>
          <h3>3. Neural Network Data Flow</h3>
        </div>
        <NeuralVisionCanvas model={model} grid={grid} config={config} />
      </div>
    </div>
  );
}

export default App;
