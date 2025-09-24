import * as tf from '@tensorflow/tfjs';
import { ref, watch, computed } from 'vue';
import { usePollenData } from './usePollenData';
import { useSymptomTracker } from './useSymptomTracker';
import { settings } from './useUserSettings'; // Import settings directly
import { POLLEN_DISPLAY_NAMES } from '../pollen'; // Import all pollen types
import { ML_PREDICTION_THRESHOLD_YES, ML_PREDICTION_THRESHOLD_MAYBE } from '../config'; // Import ML thresholds

const MODEL_STORAGE_KEY = 'sneeze-ml-model';

// Basic debounce utility
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

export function useSneezeMLPrediction() {
  const model = ref(null);
  const rawHourlyPredictions = ref([]); // Store raw probabilities for each pollen type
  const loading = ref(false);
  const error = ref(null);

  const { parsedData } = usePollenData();
  const { symptoms } = useSymptomTracker();
  // settings is now directly imported

  const allPollenTypes = Object.keys(POLLEN_DISPLAY_NAMES); // Use all pollen types

  const buildAndLoadModel = async () => {
    const numFeatures = 1 + allPollenTypes.length; // 1 for hour + number of all pollen types
    const numOutputs = allPollenTypes.length; // One output for each pollen type

    try {
      // Try to load existing model
      model.value = await tf.io.loadLayersModel(`localstorage://${MODEL_STORAGE_KEY}`);
      console.log('ML model loaded from local storage.');
      // Ensure loaded model has correct output shape
      if (model.value.outputs[0].shape[1] !== numOutputs) {
        console.warn('Loaded model has incorrect output shape, rebuilding.');
        throw new Error('Incorrect model shape');
      }
    } catch (e) {
      console.log('No ML model found in local storage or incorrect shape, building new model.', e);
      // If no model found or incorrect shape, build a new one
      model.value = tf.sequential();
      model.value.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [numFeatures] }));
      model.value.add(tf.layers.dense({ units: numOutputs, activation: 'sigmoid' })); // Multi-output
      model.value.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' }); // Use binaryCrossentropy for multi-label
    }
  };

  const prepareData = (symptoms, parsedData) => {
    const trainingFeatures = [];
    const trainingLabels = []; // Will be a 2D array for multi-label

    // Prepare training data from historical symptoms and pollen data
    symptoms.value.forEach(symptom => {
      if (symptom.pollenDataAtTimeOfLog && symptom.severity !== undefined) {
        const symptomDate = new Date(symptom.time);
        const hour = symptomDate.getHours();
        const featureVector = [hour];
        const labelVector = Array(allPollenTypes.length).fill(0); // Initialize label vector for this symptom

        allPollenTypes.forEach((pollenType, index) => {
          const pollenValue = symptom.pollenDataAtTimeOfLog.hourly_data?.[pollenType] || 0;
          featureVector.push(pollenValue);

          // Heuristic for allergy label: if symptom severity is high and pollen is present
          if (symptom.severity >= 3 && pollenValue > 0) {
            labelVector[index] = 1;
          }
        });

        trainingFeatures.push(featureVector);
        trainingLabels.push(labelVector); // Push the label vector
      }
    });

    // Prepare prediction inputs for the current day, hourly until midnight
    const predictionInputs = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let h = currentHour; h <= 23; h++) {
      const hourData = parsedData.value.hourly?.[h];
      const featureVector = [h];

      allPollenTypes.forEach(pollenType => {
        const pollenValue = hourData?.[pollenType] || 0;
        featureVector.push(pollenValue);
      });
      predictionInputs.push(featureVector);
    }

    const xs = trainingFeatures.length > 0 ? tf.tensor2d(trainingFeatures) : null;
    const ys = trainingLabels.length > 0 ? tf.tensor2d(trainingLabels) : null; // ys is now 2D
    const predictionXs = predictionInputs.length > 0 ? tf.tensor2d(predictionInputs) : null;

    return { xs, ys, predictionXs, hasTrainingData: trainingFeatures.length > 0, hasPredictionInputs: predictionInputs.length > 0 };
  };

  // getPredictionCategory now interprets probability for a single pollen type
  const getPredictionCategory = (probability) => {
    if (probability > ML_PREDICTION_THRESHOLD_YES) {
      return 'yes';
    } else if (probability > ML_PREDICTION_THRESHOLD_MAYBE) {
      return 'maybe';
    } else {
      return 'no';
    }
  };

  const trainAndPredict = async () => {
    loading.value = true;
    error.value = null;
    rawHourlyPredictions.value = [];

    if (!model.value) {
      await buildAndLoadModel(); // Ensure model is built or loaded
    }

    try {
      const { xs, ys, predictionXs, hasTrainingData, hasPredictionInputs } = prepareData(symptoms, parsedData);

      if (!hasTrainingData || !xs || !ys) {
        console.warn('Not enough training data (need at least one logged symptom with pollen data) to train ML model. ML prediction will be unavailable until more data is logged.');
        loading.value = false;
        xs?.dispose();
        ys?.dispose();
        predictionXs?.dispose();
        return;
      }

      await model.value.fit(xs, ys, {
        epochs: 50,
      });

      // Save model after successful training
      await tf.io.save(`localstorage://${MODEL_STORAGE_KEY}`);
      console.log('ML model saved to local storage.');

      if (hasPredictionInputs && predictionXs) {
        const predictionsTensor = model.value.predict(predictionXs);
        const predictionsArray = await predictionsTensor.array(); // predictionsArray is now 2D (num_hours x num_pollen_types)

        const now = new Date();
        const currentHour = now.getHours();
        rawHourlyPredictions.value = predictionsArray.map((hourPreds, index) => ({
          hour: currentHour + index,
          // Store probabilities for each pollen type
          probabilities: allPollenTypes.reduce((acc, pollenType, pIdx) => {
            acc[pollenType] = hourPreds[pIdx];
            return acc;
          }, {}),
        }));
        predictionsTensor.dispose();
      } else {
        console.warn('No prediction inputs available. Skipping prediction.');
      }

      xs.dispose();
      ys.dispose();
      predictionXs?.dispose();

    } catch (e) {
      console.error('TensorFlow ML Prediction Error:', e);
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  // Debounce the trainAndPredict function
  const debouncedTrainAndPredict = debounce(trainAndPredict, 1000); // 1 second debounce

  watch([parsedData, symptoms, settings], debouncedTrainAndPredict, { immediate: true });

  const mlHourlyPredictions = computed(() => {
    return rawHourlyPredictions.value.map(p => ({
      hour: p.hour,
      // For each hour, provide predictions for each pollen type
      predictions: allPollenTypes.map(pollenType => ({
        pollenType,
        prediction: getPredictionCategory(p.probabilities[pollenType] || 0),
      })),
    }));
  });

  const mlOverallPrediction = computed(() => {
    if (rawHourlyPredictions.value.length === 0) return null;

    const allergicPollenTypes = new Set();
    rawHourlyPredictions.value.forEach(hourPred => {
      allPollenTypes.forEach(pollenType => {
        if (getPredictionCategory(hourPred.probabilities[pollenType] || 0) === 'yes') {
          allergicPollenTypes.add(pollenType);
        }
      });
    });

    if (allergicPollenTypes.size > 0) {
      return Array.from(allergicPollenTypes).map(pollenType => POLLEN_DISPLAY_NAMES[pollenType] || pollenType).join(', ');
    } else {
      return 'No significant allergy predicted';
    }
  });

  return {
    mlOverallPrediction,
    mlHourlyPredictions,
    loading, // Corrected from isLoading
    error,
  };
}