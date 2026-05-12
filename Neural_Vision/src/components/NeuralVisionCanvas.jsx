import React, { useState, useEffect } from "react";
import { ProcessNeuralInference } from "../utils/aiUtils";

const NeuralVisionCanvas = ({ isPredicting, setIsPredicting, grid, config }) => {
  const [predictionDebug, setPredictionDebug] = useState("Waiting for data...");
  const [activePixels, setActivePixels] = useState(0);

  useEffect(() => {
    const drawnPixels = grid.filter((value) => value > 0).length;
    setActivePixels(drawnPixels);

    if (!isPredicting) {
      return;
    }

    if (drawnPixels === 0) {
      setPredictionDebug("Canvas is empty. Draw a number first.");
      setIsPredicting(false);
      return;
    }

    let cancelled = false;

    const runInference = async () => {
      try {
        const result = await ProcessNeuralInference(config, grid);
        if (cancelled) {
          return;
        }

        const prediction = result?.prediction ?? [];
        const bestDigit = result?.bestDigit ?? -1;

        if (bestDigit >= 0 && prediction.length) {
          const confidence = ((prediction[bestDigit] || 0) * 100).toFixed(2);
          setPredictionDebug(
            `AI Predicts: ${bestDigit} (Confidence: ${confidence}%)`,
          );
        } else {
          setPredictionDebug("No prediction returned.");
        }
      } catch (error) {
        console.error("Inference error:", error);
        if (!cancelled) {
          setPredictionDebug("Error running prediction.");
        }
      } finally {
        if (!cancelled) {
          setIsPredicting(false);
        }
      }
    };

    runInference();

    return () => {
      cancelled = true;
    };
  }, [isPredicting, grid, config, setIsPredicting]); 

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
