# Neural Vision: Interactive Neural Network Visualization

**CEDT INNOVATION SUMMIT 2026**

![Neural Vision](https://img.shields.io/badge/TensorFlow.js-orange?style=flat-square) ![React](https://img.shields.io/badge/React-blue?style=flat-square) ![Vite](https://img.shields.io/badge/Vite-purple?style=flat-square)

## 🎯 Project Overview

**Neural Vision** is an interactive web-based visualization tool for understanding how fully connected neural networks process handwritten digit recognition. Users can draw a 28×28 pixel image, configure the network architecture (number of layers, activation functions), and watch in real-time as the input flows through each layer with animated neuron activations.

This project demonstrates:
- ✨ Real-time neural network inference using TensorFlow.js
- 🎨 Canvas-based visualization of network architecture and activation dynamics
- 🔧 Configurable network layers and activation functions (ReLU, Sigmoid, Tanh)
- 📊 Interactive learning experience for understanding neural networks

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
cd Neural_Vision
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 📋 Dataset & Model Training

### Dataset: MNIST

The model is trained on the **MNIST dataset** from TensorFlow/Keras:
- **Training set**: 60,000 images (28×28 pixels)
- **Test set**: 10,000 images (28×28 pixels)
- **Classes**: Digits 0–9

```python
assert x_train.shape == (60000, 28, 28)
assert x_test.shape == (10000, 28, 28)
assert y_train.shape == (60000,)
assert y_test.shape == (10000,)
```

### Model Architecture

This project uses a **fully connected neural network** (not CNN) to demonstrate weight-based inference:

| Component | Details |
|-----------|---------|
| **Input Layer** | 28×28 pixels (784 flattened neurons) |
| **Hidden Layers** | Configurable Dense layers (1–20 layers) |
| **Output Layer** | 10 neurons (digits 0–9) with Softmax |
| **Optimizer** | Adam |
| **Activation Functions** | ReLU, Sigmoid, Tanh |

### Train Your Own Model

Follow this Google Colab notebook to train the model with different configurations:

👉 **[Open Training Notebook (Google Colab)](https://colab.research.google.com/drive/1BKavuoEhPoijrXXeS-Ttoty4fqgtZoJT?usp=sharing)**

#### Steps to Download and Integrate Models:

1. **Open the Colab notebook** and run all cells to train models
2. **Extract and reorganize**:
   ```bash
   unzip models.zip
   # You'll get a folder structure like: all_web_models/models/model_*.../
   ```
3. **Copy to project**:
   ```bash
   # Copy ONLY the model directories to public/models/
   ```
   
   **Result structure**:
   ```
   public/models/
   ├── model_relu_1layer_tfjs/
   ├── model_relu_2layer_tfjs/
   ├── model_sigmoid_5layer_tfjs/
   └── ... (other models)
   ```

4. **Verify**: Check that each model folder contains:
   - `model.json`
   - `model.weights.bin`

---

## 🎨 Visualization Guide

### How Neurons Are Rendered

- **Neuron Size**: Represents the **activation value** of that neuron
  - Larger circle = stronger activation (closer to 1)
  - Smaller circle = weaker activation (closer to 0)
  
- **Neuron Color**: 
  - Red/Orange = high activation
  - Darker = low activation
  
- **Connection Lines**: 
  - Purple lines connect layers
  - Line opacity/thickness indicates connection weight strength

### Input Grid

- Displayed as a **28×28 grayscale grid** on the left
- Shows the exact pixels you drew on the canvas
- Serves as the network's input

### Layer Visualization

- **Input Layer**: 28×28 grid representation
- **Hidden Layers**: Configurable neurons (up to 16 visible per layer for performance)
- **Output Layer**: 10 neurons representing confidence for each digit (0–9)

---

## 🏗️ Project Structure

```
Neural_Vision/
├── public/
│   ├── models/                    # TensorFlow.js models
│   │   ├── model_relu_1layer_tfjs/
│   │   ├── model_relu_2layer_tfjs/
│   │   └── ...
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ConfigPanel.jsx       # Model configuration UI
│   │   ├── DrawingCanvas.jsx     # User drawing interface
│   │   ├── NeuralVisionCanvas.jsx # Network visualization
│   │   ├── Loading.jsx           # Loading indicator
│   │   ├── Info.jsx              # Project information
│   │   └── TechnicalDetails.jsx  # Technical specs
│   ├── utils/
│   │   └── aiUtils.js            # TensorFlow.js model loading & inference
│   ├── App.jsx               # Main app component
|   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎛️ Configuration Options

In the **Config Panel**, you can adjust:

- **Number of Layers**: 1–20 hidden layers
- **Activation Function**: ReLU, Sigmoid, or Tanh
- **Model Prediction**: Trigger inference with the "Predict" button

---

## 🔬 Technical Details

### Technologies Used

- **Frontend**: React 19 with Vite
- **ML Inference**: TensorFlow.js
- **Visualization**: HTML5 Canvas API
- **Styling**: Tailwind CSS (via inline styles)

### Performance Optimizations

- **14×14 Downsampling**: Input layer uses 14×14 sampling to reduce rendering load
- **Limited Neuron Display**: Only 16 neurons per hidden layer are rendered (sampling)
- **Canvas Optimization**: Real-time rendering with debounced updates

---

## 📱 Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🤝 Features

### Drawing Canvas
- ✏️ Draw handwritten digits (0–9) in a 28×28 grid
- 🔄 Clear button to reset the canvas
- 📊 Real-time pixel count display

### Network Visualization
- 🧠 Real-time layer-by-layer activation visualization
- 📈 Dynamically sized neurons based on activation values
- 🔗 Connection strength visualization
- 📝 Neuron labels on the output layer

### Configuration
- 🎚️ Adjustable network depth (1–20 layers)
- 🔌 Multiple activation functions (ReLU, Sigmoid, Tanh)
- 🎯 Pre-trained model selection

---

## 🛠️ Development

### Project Dependencies

- `@tensorflow/tfjs`: ML inference engine
- `react`: UI framework
- `vite`: Build tool

---

## 📄 License

Open source project for educational purposes.

---

## 🎤 Presented At

**CEDT INNOVATION SUMMIT 2026**

---

## 📧 Contact & Support

For questions or suggestions, please open an issue or contact the project maintainers.

---