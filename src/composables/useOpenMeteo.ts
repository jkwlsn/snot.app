import { ref, readonly, type Ref } from "vue";
import { fetchWeatherApi } from "openmeteo";
import {
  OPENMETEO_API_PARAMS,
  OPENMETEO_API_URL,
  OPENMETEO_POLLEN_TYPES,
} from "../config";
import type { PollenData, PollenRecord } from "../interfaces/Pollen";
import type { PollenType, PollenLevels } from "../interfaces/PollenTypes";
import type { OpenMeteoAPIParams } from "../interfaces/openmeteoapiparams";

const openMeteoData = ref<PollenData | null>(null);
const openMeteoLoading = ref<boolean>(false);
const openMeteoError = ref<Error | null>(null);

async function openMeteoFetch(parameters: OpenMeteoAPIParams): Promise<void> {
  openMeteoLoading.value = true;
  openMeteoError.value = null;

  try {
    const queryParameters: OpenMeteoAPIParams = {
      latitude: parameters.latitude,
      longitude: parameters.longitude,
      hourly: parameters.hourly ?? OPENMETEO_POLLEN_TYPES,
      timezone: "UTC",
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
    const startTime = Number(hourly.time());
    const endTime = Number(hourly.timeEnd());
    const interval = hourly.interval();

    if (isNaN(startTime) || isNaN(endTime) || isNaN(interval)) {
      throw new Error("Invalid time values encountered.");
    }

    const timeArray = Array.from(
      { length: (endTime - startTime) / interval },
      (_, i) => new Date((startTime + i * interval) * 1000),
    );

    const records: PollenRecord[] = timeArray.map((time, index) => {
      const levels: PollenLevels = {} as PollenLevels;
      OPENMETEO_POLLEN_TYPES.forEach((pollenType: PollenType, pollenIndex: number) => {
        const value = getVariableData(pollenIndex)[index];
        levels[pollenType] = (typeof value === 'number' && !isNaN(value)) ? value : null;
      });
      return { timestamp: time, levels };
    });

    // Create JSON object to export out of composable
    openMeteoData.value = {
      latitude: response.latitude(),
      longitude: response.longitude(),
      records: records,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("openMeteoFetch failed:", error.message);
      openMeteoError.value = error;
    } else {
      const unknownErrorString = String(error);
      console.error("openMeteoFetch failed: An unknown error occurred.", unknownErrorString);
      openMeteoError.value = new Error(`An unknown error occurred: ${unknownErrorString}`);
    }
    openMeteoData.value = null;
  } finally {
    openMeteoLoading.value = false;
  }
}

export function useOpenMeteoAPI(): {
  data: Readonly<Ref<PollenData | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<Error | null>>;
  openMeteoFetch: (parameters: OpenMeteoAPIParams) => Promise<void>;
} {
  return {
    data: readonly(openMeteoData),
    loading: readonly(openMeteoLoading),
    error: readonly(openMeteoError),
    openMeteoFetch,
  };
}
