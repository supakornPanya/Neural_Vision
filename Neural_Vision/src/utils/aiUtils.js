import * as tf from "@tensorflow/tfjs";

const modelCache = {};
const modelLoaders = {}; // key -> Promise resolving to model
let ongoingInference = null; // Promise for an in-progress inference

const normalizeInputLayer = (layerConfig) => {
  if (!layerConfig || layerConfig.class_name !== "InputLayer") {
    return layerConfig;
  }

  const config = { ...(layerConfig.config || {}) };

  if (config.batch_shape) {
    config.batchInputShape = config.batch_shape;
    delete config.batch_shape;
  }

  delete config.inputShape;

  return {
    ...layerConfig,
    config,
  };
};

const patchModelTopology = (modelTopology) => {
  if (!modelTopology?.model_config?.config?.layers) {
    return modelTopology;
  }

  return {
    ...modelTopology,
    model_config: {
      ...modelTopology.model_config,
      config: {
        ...modelTopology.model_config.config,
        layers:
          modelTopology.model_config.config.layers.map(normalizeInputLayer),
      },
    },
  };
};

const loadLayersModel = async (modelPath) => {
  const response = await fetch(modelPath);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch model manifest: ${response.status} ${response.statusText}`,
    );
  }

  const manifest = await response.json();
  const patchedTopology = patchModelTopology(manifest.modelTopology);
  const basePath = modelPath.replace(/\/[^/]*$/, "");
  const weightGroups = manifest.weightsManifest || [];
  const weightSpecs = weightGroups.flatMap((group) => group.weights || []);
  const weightDataParts = [];

  for (const group of weightGroups) {
    for (const relativePath of group.paths || []) {
      const weightUrl = `${basePath}/${relativePath}`;
      const weightResponse = await fetch(weightUrl);
      if (!weightResponse.ok) {
        throw new Error(
          `Failed to fetch model weights: ${weightUrl} (${weightResponse.status} ${weightResponse.statusText})`,
        );
      }
      weightDataParts.push(await weightResponse.arrayBuffer());
    }
  }

  const totalBytes = weightDataParts.reduce(
    (sum, part) => sum + part.byteLength,
    0,
  );
  const mergedWeightData = new Uint8Array(totalBytes);
  let offset = 0;
  for (const part of weightDataParts) {
    mergedWeightData.set(new Uint8Array(part), offset);
    offset += part.byteLength;
  }

  return await tf.loadLayersModel({
    load: async () => ({
      modelTopology: patchedTopology,
      weightSpecs,
      weightData: mergedWeightData.buffer,
    }),
  });
};

export const ProcessNeuralInference = async (config, input255) => {
  if (ongoingInference) {
    return await ongoingInference;
  }

  ongoingInference = (async () => {
    let predictionResults = [];
    let influencePercentages = [];
    let inputTensor = null;
    let predictionTensor = null;

    try {
      console.log("--- NEURAL INFERENCE START ---");

      // Step 1: Prepare model key and path based on config
      const normalizedInput = input255.map((value) => value / 255.0);
      const layerCount = Math.max(1, Number(config.layers) || 1);
      const key = `${config.activation}_${layerCount}`;
      const folderName = `model_${config.activation}_${layerCount}layer_tfjs`;
      const modelPath = `/models/${folderName}/model.json`;

      let model = modelCache[key];
      if (!model) {
        if (!modelLoaders[key]) {
          modelLoaders[key] = loadLayersModel(modelPath)
            .then((loadedModel) => {
              modelCache[key] = loadedModel;
              delete modelLoaders[key];
              console.log(`Model loaded and cached: ${modelPath}`);
              return loadedModel;
            })
            .catch((error) => {
              delete modelLoaders[key];
              throw error;
            });
        }

        model = await modelLoaders[key];
      }

      // Step 2: Run Model Prediction
      inputTensor = tf.tensor(normalizedInput, [1, 28, 28, 1], "float32");
      predictionTensor = model.predict(inputTensor);
      const predT = Array.isArray(predictionTensor)
        ? predictionTensor[0]
        : predictionTensor;

      predictionResults = Array.from(await predT.data());
      console.log("Prediction results:", predictionResults);

      // Step 3: Compute Neuron Influence
      const denseLayer = model.layers.find(
        (layer) => layer.getClassName() === "Dense",
      );
      if (denseLayer) {
        const weights = denseLayer.getWeights();
        const kernelTensor = weights[0];

        if (kernelTensor) {
          const kernelArray = await kernelTensor.array();
          console.log(
            "Dense kernel shape [input_neurons, output_neurons]:",
            kernelTensor.shape,
          );
          console.log("Raw weights by input neuron:", kernelArray);
          const neuronAbsSums = kernelArray.map((neuronWeights) =>
            neuronWeights.reduce((sum, weight) => sum + Math.abs(weight), 0),
          );
          const totalAbsSum =
            neuronAbsSums.reduce((sum, value) => sum + value, 0) || 1;
          influencePercentages = neuronAbsSums.map((sum) => sum / totalAbsSum);
          console.log("Absolute weight sum per input neuron:", neuronAbsSums);
          console.log(
            "Influence percentage per input neuron:",
            influencePercentages,
          );
        }
      } else {
        console.warn("No Dense layer found to compute neuron influence.");
      }

      // Step 4: Clean up tensors about Memory Management
      if (Array.isArray(predictionTensor)) {
        predictionTensor.forEach((tensor) => tensor?.dispose?.());
      } else {
        predictionTensor?.dispose?.();
      }
      inputTensor?.dispose?.();

      return {
        prediction: predictionResults,
        influence: influencePercentages,
      };
    } catch (error) {
      console.error("Error during neural inference:", error);
      return {
        prediction: [],
        influence: [],
        error,
      };
    } finally {
      predictionTensor?.dispose?.();
      inputTensor?.dispose?.();
      console.log("--- NEURAL INFERENCE END ---");
    }
  })();

  try {
    return await ongoingInference;
  } finally {
    ongoingInference = null;
  }
};
