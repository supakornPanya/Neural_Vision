import React from 'react';

const ConfigPanel = ({ config, setConfig, onStartPrediction}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
      <div className="config-item">
        <label>Hidden Layers: {config.layers}</label>
        <input
          type="range"
          name="layers"
          min="0"
          max="20"
          value={config.layers}
          onChange={handleChange}
          style={{ accentColor: "#00FFC2" }}
        />
      </div>

      <div className="config-item">
        <label>Activation Function:</label>
        <select
          name="activation"
          value={config.activation}
          onChange={handleChange}
        >
          <option value="relu">ReLU</option>
          <option value="sigmoid">Sigmoid</option>
          <option value="tanh">Tanh</option>
        </select>
      </div>

      <button
        style={{
          marginTop: "20px",
          background: "linear-gradient(to right, #A456FA, #4A22E5)", // Violet to Deep Blue
          color: "white",
          border: "none",
          padding: "10px 25px",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "600",
        }}
        onClick={onStartPrediction}
      >
        Start Prediction
      </button>
    </div>
  );
};

export default ConfigPanel;