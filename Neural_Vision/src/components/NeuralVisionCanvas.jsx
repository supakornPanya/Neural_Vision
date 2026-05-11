import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const NeuralVisionCanvas = ({ model, grid, config }) => {
  const [predictionDebug, setPredictionDebug] = useState("Waiting for data...");
  const [activePixels, setActivePixels] = useState(0);

  useEffect(() => {
    // 1. Safety Checks
    if (!model) {
      setPredictionDebug("Model is currently loading...");
      return;
    }

    // Count how many pixels the user actually drew
    const drawnPixels = grid.filter((val) => val > 0).length;
    setActivePixels(drawnPixels);

    if (drawnPixels === 0) {
      setPredictionDebug("Canvas is empty. Draw a number!");
      return;
    }

    // 2. Run the actual math (The Data Pipeline Test)
    const runInference = async () => {
      try {
        // Convert grid to tensor [1, 28, 28, 1]
        const inputTensor = tf
          .tensor(grid, [1, 28, 28, 1], "float32")
          .div(255.0);

        // Run prediction
        const outputTensor = model.predict(inputTensor);
        const softmaxScores = await outputTensor.array(); // Get the raw array

        // Find the highest score
        const scores = softmaxScores[0];
        const bestIndex = scores.indexOf(Math.max(...scores));
        const confidence = (scores[bestIndex] * 100).toFixed(2);

        setPredictionDebug(
          `AI Predicts: ${bestIndex} (Confidence: ${confidence}%)`,
        );

        // Cleanup memory to prevent lag
        inputTensor.dispose();
        outputTensor.dispose();
      } catch (err) {
        console.error("Math error:", err);
        setPredictionDebug("Error running prediction.");
      }
    };

    runInference();
  }, [model, grid]); // This array is the "Trigger" - it runs whenever model or grid changes

  return (
    <div
      className="visualization-area"
      style={{
        padding: "30px",
        background: "rgba(0, 0, 0, 0.5)",
        border: "1px solid #4A22E5",
        borderRadius: "12px",
        color: "#FFFFFF",
      }}
    >
      <h4 style={{ color: "#00FFC2", marginTop: 0 }}>SYSTEM DEBUG DASHBOARD</h4>

      <div style={{ display: "grid", gap: "10px", fontFamily: "monospace" }}>
        <div style={{ padding: "10px", background: "rgba(255,255,255,0.05)" }}>
          <strong>Active Config:</strong> {config.layers} Layer(s) |{" "}
          {config.activation.toUpperCase()}
        </div>

        <div style={{ padding: "10px", background: "rgba(255,255,255,0.05)" }}>
          <strong>Input Data:</strong> {activePixels} / 784 pixels active
        </div>

        <div
          style={{
            padding: "15px",
            background: "rgba(36, 134, 255, 0.1)",
            border: "1px solid #2486FF",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          <strong>Status:</strong> {predictionDebug}
        </div>
      </div>
    </div>
  );
};

export default NeuralVisionCanvas;
