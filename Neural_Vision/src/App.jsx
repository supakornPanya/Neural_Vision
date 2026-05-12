import React, { useState } from "react";
import DrawingCanvas from "./components/DrawingCanvas";
import ConfigPanel from "./components/ConfigPanel";
import NeuralVisionCanvas from "./components/NeuralVisionCanvas";
import "./App.css";
import LoadingOverlay from "./components/Loading";

function App() {
  // --- STATE MANAGEMENT ---
  const [grid, setGrid] = useState(Array(784).fill(0)); // 28x28 flattened
  const [isPredicting, setIsPredicting] = useState(false);
  const initialConfig = {
    layers: 1, // 1 to 20
    activation: "relu", // relu, sigmoid, tanh
    noise: 0,
  };
  const [config, setConfig] = useState({
    ...initialConfig,
  });

  // --- FUNCTIONALITY ---
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

  return (
    <div className="app-container">
      {isPredicting && <LoadingOverlay />}
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
            isPredicting={isPredicting}
            setIsPredicting={setIsPredicting}
          />
        </div>
      </div>

      {/* ROW 2: VISUALIZATION */}
      {/* <div className="row row-2 m-8"> */}
        <div className="card-header">
          <div className="status-dot"></div>
          <h3>3. Neural Network Data Flow</h3>
        </div>

        <NeuralVisionCanvas
          isPredicting={isPredicting}
          setIsPredicting={setIsPredicting}
          grid={grid}
          config={config}
        />
      {/* </div> */}
    </div>
  );
}

export default App;
