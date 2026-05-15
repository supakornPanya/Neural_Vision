import React from "react";

const TechnicalDetails = () => {
  return (
    <div
      style={{
        padding: "30px",
        background: "rgba(10, 10, 25, 0.85)",
        border: "1px solid #A456FA",
        borderRadius: "12px",
        color: "#FFFFFF",
        fontFamily: "monospace",
        lineHeight: "1.6",
        maxWidth: "800px",
        margin: "20px auto",
      }}
    >
      <h2
        style={{
          color: "#00FFC2",
          borderBottom: "2px solid #00FFC2",
          paddingBottom: "10px",
        }}
      >
        SYSTEM SPECIFICATIONS: NEURAL VISION
      </h2>

      {/* --- DATA TRAINING SECTION --- */}
      <section style={{ marginBottom: "25px" }}>
        <h3 style={{ color: "#A456FA" }}>
          01. DATASET: MNIST HANDWRITTEN DIGITS
        </h3>
        <p>
          The model was trained using the <strong>MNIST</strong> dataset, the
          industry standard for computer vision benchmarks. It consists of
          grayscale images of handwritten digits (0-9).
        </p>
        <div
          style={{
            background: "#000",
            padding: "15px",
            borderRadius: "6px",
            border: "1px solid #333",
          }}
        >
          <code style={{ color: "#00FFC2" }}>
            // Dataset verification shapes:
            <br />
            assert x_train.shape == (60000, 28, 28)
            <br />
            assert x_test.shape == (10000, 28, 28)
            <br />
            assert y_train.shape == (60000,)
            <br />
            assert y_test.shape == (10000,)
          </code>
        </div>
        <img src="../../public/Sample_mnist_dataset.png" alt="MNIST Dataset" />
      </section>

      {/* --- MODEL ARCHITECTURE SECTION --- */}
      <section style={{ marginBottom: "25px" }}>
        <h3 style={{ color: "#A456FA" }}>02. MODEL ARCHITECTURE (NON-CNN)</h3>
        <p>
          Unlike modern Convolutional Neural Networks (CNNs), this project
          utilizes a<strong> Fully Connected Neural Network</strong> to
          demonstrate raw weight-based inference.
        </p>
        <table
          style={{
            width: "100%",
            textAlign: "left",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #444" }}>
              <th style={{ padding: "8px" }}>Layer</th>
              <th style={{ padding: "8px" }}>Type / Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px" }}>Input</td>
              <td style={{ padding: "8px" }}>28x28 (784 Flattened Neurons)</td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Hidden</td>
              <td style={{ padding: "8px" }}>Dense Layers (Configurable)</td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Output</td>
              <td style={{ padding: "8px" }}>
                Dense (10 Neurons) with Softmax
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Optimizer</td>
              <td style={{ padding: "8px" }}>Adam Optimizer</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: "15px" }}>
          <a
            href="https://colab.research.google.com/drive/1BKavuoEhPoijrXXeS-Ttoty4fqgtZoJT?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#00FFC2",
              textDecoration: "none",
              borderBottom: "1px dashed #00FFC2",
            }}
          >
            &gt; View Training Notebook (Google Colab)
          </a>
        </p>
      </section>

      {/* --- VISUALIZATION SECTION --- */}
      <section>
        <h3 style={{ color: "#A456FA" }}>03. VISUALIZATION ENGINE</h3>
        <p>
          The network visualization is rendered in real-time using a custom
          HTML5 Canvas engine:
        </p>
        <ul>
          <li>
            <strong>Dynamic Sizing:</strong> Every red neuron's radius is tied
            directly to its
            <strong> Activation Value</strong> (ActivationFunction(Weight * X +
            Bias)). Higher confidence = larger circle.
          </li>
          <li>
            <strong>14x14 Downsampling:</strong> To prevent GPU overload and
            maintain 60 FPS, the 28x28 input is sampled into a 14x14 grid for
            the visualization.
          </li>
          <li>
            <strong>Weight Mapping:</strong> Connection lines vary in opacity
            based on the absolute weight strength calculated during inference.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default TechnicalDetails;
