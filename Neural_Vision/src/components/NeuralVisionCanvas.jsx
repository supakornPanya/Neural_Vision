import React, { useState, useEffect, useRef } from "react";
import { ProcessNeuralInference } from "../utils/aiUtils";

const NeuralVisionCanvas = ({ isPredicting, setIsPredicting, grid, config }) => {
  const [predictionDebug, setPredictionDebug] = useState("Waiting for data...");
  const [activePixels, setActivePixels] = useState(0);
  const [inferenceData, setInferenceData] = useState(null);
  const canvasRef = useRef(null);

  // Main Run AI
  useEffect(() => {
    // Only run when prediction is triggered
    if (!isPredicting) {
      return;
    }

    // Step 1: Count active pixels
    const drawnPixels = grid.filter((value) => value > 0).length;
    setActivePixels(drawnPixels);

    if (drawnPixels === 0) {
      setPredictionDebug("Canvas is empty. Draw a number first.");
      setIsPredicting(false);
      return;
    }

    let cancelled = false;

    // Step 2: Runing Model Inference
    const runInference = async () => {
      try {
        // Predicting...
        const result = await ProcessNeuralInference(config, grid);
        if (cancelled) {
          return;
        }

        setInferenceData(result);

        const prediction = result?.prediction ?? [];
        const influence = result?.influence ?? [];

        // Format prediction results
        if (prediction.length) {
          const bestDigit = prediction.indexOf(Math.max(...prediction));
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

    // Trick: Work like a async by loop call until get result
    runInference();

    return () => {
      cancelled = true;
    };
  }, [isPredicting, setIsPredicting, grid, config]);

  // Canvas drawing effect
  useEffect(() => {
    if (!canvasRef.current || !inferenceData) {
      return;
    }

    // Step 1: Setup canvas & Clear background
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgb(8, 3, 33)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const prediction = inferenceData.prediction || [];
    const influence = inferenceData.influence || [];

    // Network structure
    const inputNeurons = 28 * 28; // 784
    const outputNeurons = 10;
    const hiddenNeuronsPerLayer = 128;

    // Step 2: Simplified Neuron (14*14 from 28*28 Neuron).
    const inputGridSize = 28 / 2; // 14x14
    const sampledInput = [];
    for (let i = 0; i < inputGridSize; i++) { // Sampling 14 row
      for (let j = 0; j < inputGridSize; j++) { // Sampling 14 col
        const idx = Math.floor((i / inputGridSize) * 28) * 28 + Math.floor((j / inputGridSize) * 28);
        sampledInput.push(influence[idx] || 0);
      }
    }

    // Step 3: Calculate positions
    // Canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const margin = 40;
    const usableWidth = canvasWidth - 2 * margin;
    const usableHeight = canvasHeight - 2 * margin;
    // Calculate layer positions
    const totalLayers = 2 + Math.max(1, config.layers); // input + hidden + output
    const layerSpacing = usableWidth / (totalLayers - 1);

    // Step 4: Drawing helper functions
    const drawNeuron = (x, y, radius, activation, label) => {
      // Neuron circle
      ctx.fillStyle = `rgba(255, ${25 + activation * 50}, 0, ${0.3 + activation * 0.7})`;
      // ctx.strokeStyle = `rgba(255, 200, 0, ${0.5 + activation * 0.5})`;
      // ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Label
      if (label !== undefined) {
        ctx.fillStyle = "#00FFC2";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y);
      }
    };

    // Step 5: Draw connections with weight-based styling
    const drawConnection = (x1, y1, x2, y2, weight) => {
      ctx.strokeStyle = `rgba(74, 34, 229, ${Math.min(1, weight * 0.8)})`;
      ctx.lineWidth = Math.max(0.5, weight * 3);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // Step 6: Layer data structure
    const layers = [];

    // Layer 0: Input (downsampled)
    // const inputLayer = [];
    // for (let i = 0; i < sampledInput.length; i++) {
    //   const x = margin + 0 * layerSpacing;
    //   const row = Math.floor(i / inputGridSize);
    //   const col = i % inputGridSize;
    //   const ySpacing = usableHeight / (inputGridSize + 1);
    //   const y = margin + (row + 1) * ySpacing;
    //   const xSpacing = usableWidth / (inputGridSize + 2);
    //   const adjustedX = margin + (col + 1) * xSpacing;
    //   inputLayer.push({
    //     x: adjustedX,
    //     y: y,
    //     activation: sampledInput[i],
    //     label: Math.round(sampledInput[i] * 100),
    //   });
    // }
    // layers.push(inputLayer);

    // Hidden layers
    for (let layer = 0; layer < config.layers; layer++) {
      const hiddenLayer = [];
      const numNeurons = Math.min(hiddenNeuronsPerLayer, 16); // Limit for visualization
      const ySpacing = usableHeight / (numNeurons + 1);

      for (let i = 0; i < numNeurons; i++) {
        const x = margin + (layer + 1) * layerSpacing;
        const y = margin + (i + 1) * ySpacing;
        const activation = Math.random() * 0.5 + 0.3; // Placeholder
        hiddenLayer.push({
          x,
          y,
          activation,
          label: layer + 1,
        });
      }
      layers.push(hiddenLayer);
    }

    // Output layer
    const outputLayer = [];
    const ySpacing = usableHeight / (outputNeurons + 1);
    for (let i = 0; i < outputNeurons; i++) {
      const x = margin + (totalLayers - 1) * layerSpacing;
      const y = margin + (i + 1) * ySpacing;
      const activation = prediction[i] || 0;
      outputLayer.push({
        x,
        y,
        activation,
        label: i,
      });
    }
    layers.push(outputLayer);

    // Draw connections
    for (let layerIdx = 0; layerIdx < layers.length - 1; layerIdx++) {
      const currentLayer = layers[layerIdx];
      const nextLayer = layers[layerIdx + 1];

      for (let i = 0; i < Math.min(currentLayer.length, 8); i++) {
        for (let j = 0; j < nextLayer.length; j++) {
          const weight = (currentLayer[i].activation + nextLayer[j].activation) / 2;
          drawConnection(
            currentLayer[i].x,
            currentLayer[i].y,
            nextLayer[j].x,
            nextLayer[j].y,
            weight,
          );
        }
      }
    }

    // Draw neurons
    for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
      const layer = layers[layerIdx];
      const radiusScale = layerIdx === 0 ? 3 : 6;

      for (const neuron of layer) {
        const radius = Math.max(2, radiusScale * neuron.activation * 1.7);
        drawNeuron(
          neuron.x,
          neuron.y,
          radius,
          neuron.activation,
          layerIdx === layers.length - 1 ? neuron.label : undefined,
        );
      }
    }

    // Draw layer labels
    ctx.fillStyle = "#00FFC2";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    const layerLabels = [
      "Input",
      ...Array(Number(config.layers))
        .fill(0)
        .map((_, i) => `Hidden ${i + 1}`),
      "Output",
    ];
    for (let i = 0; i < layerLabels.length; i++) {
      const x = margin + i * layerSpacing;
      ctx.fillText(layerLabels[i], x, margin - 15);
    }
  }, [inferenceData]);

  return (
    <div
      style={{
        padding: "30px",
        background: "rgba(0, 0, 0, 0.5)",
        border: "1px solid #4A22E5",
        borderRadius: "12px",
        color: "#FFFFFF",
      }}
    >
      <h4 style={{ color: "#00FFC2", marginTop: 0 }}>NEURAL NETWORK VISUALIZATION</h4>

      <canvas
        ref={canvasRef}
        width={1000}
        height={500}
        style={{
          display: "block",
          width: "100%",
          maxWidth: "2000px",
          height: "auto",
          border: "1px solid rgba(164, 86, 250, 0.5)",
          borderRadius: "8px",
          marginBottom: "20px",
          background: "rgba(16, 14, 26, 0.9)",
        }}
      />

      <div style={{ display: "grid", gap: "10px", fontFamily: "monospace" }}>
        <div style={{ padding: "10px", background: "rgba(255,255,255,0.05)" }}>
          <strong>Config:</strong> {config.layers} Layer(s) |{" "}
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
