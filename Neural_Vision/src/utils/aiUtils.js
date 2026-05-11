import * as tf from "@tensorflow/tfjs";

/**
 * Computes prediction and weight influence for the Neural Network.
 * Formula: Influence % = sum(|neuron weights|) / sum(all layer weights)
 */
export const computeNeuralData = async (model, gridData) => {
  return tf.tidy(() => {
    console.log("--- AI Computation Started ---");

    // 1. Normalize Input (0-255 to 0-1)
    console.log("Step 1: Normalizing input data to [0, 1] range.");
    const inputTensor = tf
      .tensor(gridData, [1, 28, 28, 1], "float32")
      .div(255.0);

    // 2. Run Prediction
    console.log("Step 2: Running model prediction.");
    const outputTensor = model.predict(inputTensor);
    const softmaxScores = outputTensor.dataSync(); // Returns array of 10 scores
    console.log("Step 2.1: Prediction scores retrieved:", softmaxScores);

    // 3. Get Weights of the First Dense Layer
    console.log("Step 3: Extracting weights from Layer 1.");
    // model.layers[0] is usually Flatten, layers[1] is the first Dense layer
    const denseLayer = model.layers.find((l) => l.getClassName() === "Dense");
    const weightsTensor = denseLayer.getWeights()[0];
    const weightsArray = weightsTensor.arraySync(); // Shape: [784, hidden_units]

    // 4. Calculate Influence Percentage
    console.log(
      "Step 4: Calculating Relative Influence for each input neuron.",
    );

    // Sum of absolute weights for each input neuron
    const neuronAbsSums = weightsArray.map((weightsPerNeuron) =>
      weightsPerNeuron.reduce((acc, w) => acc + Math.abs(w), 0),
    );

    // Total sum of all absolute weights in the layer
    const totalLayerWeightSum = neuronAbsSums.reduce((a, b) => a + b, 0);

    // Final Influence Percentage based on your equation
    const influencePercentages = neuronAbsSums.map(
      (sum) => sum / totalLayerWeightSum,
    );

    console.log("Step 4.1: Influence Percentages calculated for 784 neurons.");
    console.log("--- AI Computation Complete ---");

    return {
      prediction: softmaxScores,
      influence: influencePercentages,
      bestDigit: softmaxScores.indexOf(Math.max(...softmaxScores)),
    };
  });
};
