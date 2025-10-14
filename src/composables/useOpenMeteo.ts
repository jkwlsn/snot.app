import { ref, readonly } from "vue";
import { fetchWeatherApi } from "openmeteo";
import { OpenMeteoAPIParams } from "../interfaces/openmeteoapiparams";
import {
  OPENMETEO_API_PARAMS,
  OPENMETEO_API_URL,
  OPENMETEO_POLLEN_TYPES,
} from "../config";

const openMeteoData = ref<OpenMeteoAPIResponse | null>(null);
const openMeteoLoading = ref<boolean>(false);
const openMeteoError = ref<Error | null>(null);

interface OpenMeteoAPIResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string | null;
  hourly: {
    time: Date[];
    alder_pollen: Float32Array | never[];
    birch_pollen: Float32Array | never[];
    grass_pollen: Float32Array | never[];
    mugwort_pollen: Float32Array | never[];
    olive_pollen: Float32Array | never[];
    ragweed_pollen: Float32Array | never[];
  };
}

async function openMeteoFetch(parameters: OpenMeteoAPIParams): Promise<void> {
  openMeteoLoading.value = true;
  openMeteoError.value = null;

  try {
    const queryParameters: OpenMeteoAPIParams = {
      latitude: parameters.latitude,
      longitude: parameters.longitude,
      hourly: parameters.hourly ?? OPENMETEO_POLLEN_TYPES,
      timezone: parameters.timezone ?? "auto",
      forecast_days: parameters.forecast_days ?? 5,
    };

    // Fetch data
    const responses = await fetchWeatherApi(
      OPENMETEO_API_URL,
      queryParameters,
      OPENMETEO_API_PARAMS.retries,
      OPENMETEO_API_PARAMS.backoffFactor,
      OPENMETEO_API_PARAMS.backoffMax,
    );

    // Process response
    const response = responses[0];

    const hourly = response.hourly();
    if (!hourly) {
      throw new Error("Hourly data is unavailable");
    }

    const getVariableData = (index: number) =>
      hourly.variables(index)?.valuesArray() ?? [];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const startTime = Number(hourly.time());
    const endTime = Number(hourly.timeEnd());
    const interval = hourly.interval();

    if (isNaN(startTime) || isNaN(endTime) || isNaN(interval)) {
      throw new Error("Invalid time values encountered.");
    }

    const timeArray = Array.from(
      { length: (endTime - startTime) / interval },
      (_, i) => new Date((startTime + i * interval + utcOffsetSeconds) * 1000),
    );

    // Create JSON object to export out of composable

    openMeteoData.value = {
      latitude: response.latitude(),
      longitude: response.longitude(),
      elevation: response.elevation(),
      timezone: response.timezone(),
      hourly: {
        time: timeArray,
        alder_pollen: getVariableData(0),
        birch_pollen: getVariableData(1),
        grass_pollen: getVariableData(2),
        mugwort_pollen: getVariableData(3),
        olive_pollen: getVariableData(4),
        ragweed_pollen: getVariableData(5),
      },
    };
  } catch (error: unknown) {
    openMeteoError.value = error as Error;
    openMeteoData.value = null;
  } finally {
    openMeteoLoading.value = false;
  }
}

export function useOpenMeteoAPI() {
  return {
    data: readonly(openMeteoData),
    loading: readonly(openMeteoLoading),
    error: readonly(openMeteoError),
    openMeteoFetch,
  };
}
