import * as tf from '@tensorflow/tfjs';
import { ref, watch, computed } from 'vue';
import { usePollenData } from './usePollenData';
import { useSymptomTracker } from './useSymptomTracker';
import { useUserSettings } from './useUserSettings';

export function useSneezeMLPrediction() {
  const model = ref(null);
  const rawHourlyPredictions = ref([]); // Store raw probabilities
  const loading = ref(false);
  const error = ref(null);

  const { parsedData } = usePollenData();
  const { symptoms } = useSymptomTracker();
  const { settings } = useUserSettings();

  const selectedPollenTypes = computed(() =>
    Object.keys(settings.value.selected_pollens || {})
  );

  const buildModel = () => {
    const numFeatures = 1 + selectedPollenTypes.value.length; // 1 for hour + number of selected pollen types
    model.value = tf.sequential();
    model.value.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [numFeatures] }));
    model.value.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.value.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  };

  const prepareData = (symptoms, parsedData, settings, selectedPollenTypes) => {
    const trainingFeatures = [];
    const trainingLabels = [];

    // Prepare training data from historical symptoms and pollen data
    symptoms.value.forEach(symptom => {
      if (symptom.pollenDataAtTimeOfLog && symptom.severity !== undefined) {
        const symptomDate = new Date(symptom.time);
        const hour = symptomDate.getHours();
        const featureVector = [hour];

        selectedPollenTypes.value?.forEach(pollenType => {
          const pollenValue = symptom.pollenDataAtTimeOfLog[pollenType]?.[0]?.value || 0;
          featureVector.push(pollenValue);
        });

        trainingFeatures.push(featureVector);
        trainingLabels.push([symptom.severity / 5]); // Normalize severity to 0-1
      }
    });

    // Prepare prediction inputs for the current day, hourly until midnight
    const predictionInputs = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let h = currentHour; h <= 23; h++) {
      const hourData = parsedData.value.hourly?.[h];
      const featureVector = [h];

      selectedPollenTypes.value.forEach(pollenType => {
        const pollenValue = hourData?.[pollenType]?.[0]?.value || 0;
        featureVector.push(pollenValue);
      });
      predictionInputs.push(featureVector);
    }

    const xs = trainingFeatures.length > 0 ? tf.tensor2d(trainingFeatures) : null;
    const ys = trainingLabels.length > 0 ? tf.tensor2d(trainingLabels) : null;
    const predictionXs = predictionInputs.length > 0 ? tf.tensor2d(predictionInputs) : null;

    return { xs, ys, predictionXs, hasTrainingData: trainingFeatures.length > 0, hasPredictionInputs: predictionInputs.length > 0 };
  };

  const getPredictionCategory = (probability) => {
    if (probability > 0.7) {
      return 'yes';
    } else if (probability > 0.4) {
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
      buildModel();
    }

    try {
      const { xs, ys, predictionXs, hasTrainingData, hasPredictionInputs } = prepareData(symptoms, parsedData, settings, selectedPollenTypes);

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

      if (hasPredictionInputs && predictionXs) {
        const predictionsTensor = model.value.predict(predictionXs);
        const predictionsArray = await predictionsTensor.array();

        const now = new Date();
        const currentHour = now.getHours();
        rawHourlyPredictions.value = predictionsArray.map((pred, index) => ({
          hour: currentHour + index,
          probability: pred[0],
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

  watch([parsedData, symptoms, settings], trainAndPredict);

  const mlHourlyPredictions = computed(() => {
    return rawHourlyPredictions.value.map(p => ({
      hour: p.hour,
      prediction: getPredictionCategory(p.probability),
    }));
  });

  const mlOverallPrediction = computed(() => {
    if (rawHourlyPredictions.value.length === 0) return null;
    // For overall prediction, let's take the highest probability among hourly predictions
    const maxProbPrediction = rawHourlyPredictions.value.reduce((max, p) => (p.probability > max.probability ? p : max), rawHourlyPredictions.value[0]);
    return getPredictionCategory(maxProbPrediction.probability);
  });

  return {
    mlOverallPrediction,
    mlHourlyPredictions,
    loading, // Corrected from isLoading
    error,
  };
}