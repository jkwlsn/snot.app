import { addHours } from "date-fns";
import type { Ref, ComputedRef } from "vue";
import { ref, computed, watch } from "vue";
import { SYMPTOM_LIST } from "../config";
import { db } from "../db";
import { useGeolocation } from "../composables/useGeolocation";
import { useOpenMeteoAPI } from "../composables/useOpenMeteo";
import { filterPollenDataByTimeframe } from "../utils/filterPollenLevelsByTimeframe";
import type { Coordinates } from "../interfaces/Coordinates";
import type {
  SymptomRecord,
  NewSymptomRecord,
} from "../interfaces/SymptomRecord";
import type { PollenRecord } from "../interfaces/Pollen";
import { createUTCDate } from "../utils/dateUtils";
import type { Timeframe } from "../interfaces/Timeframe";

interface SymptomObject {
  id: number;
  name: string;
}

export interface UseSymptomInputReturn {
  noLocation: ComputedRef<boolean>;
  selectedSymptoms: Ref<string[]>;
  symptomObjects: SymptomObject[];
  deselectAll: () => void;
  selectAll: () => void;
  logSymptoms: () => Promise<void>;
}

export function useSymptomInput(
  symptomSeverity: Ref<number>,
): UseSymptomInputReturn {
  const { data: openMeteoApiData, openMeteoFetch } = useOpenMeteoAPI();
  const apiData = computed(() => openMeteoApiData.value);

  const geolocation = useGeolocation();

  const location = computed<Coordinates | null>(
    () => geolocation.locationCoordinates.value,
  );

  const selectedSymptoms = ref<string[]>([]);

  const noLocation = computed(() => geolocation.locationCoordinates.value === null);

  const symptomObjects: SymptomObject[] = SYMPTOM_LIST.map(
    (symptom: string, index: number) => ({
      id: index,
      name: symptom,
    }),
  );

  const deselectAll = (): void => {
    selectedSymptoms.value = [];
    symptomSeverity.value = 1;
  };

  const selectAll = (): void => {
    selectedSymptoms.value = symptomObjects.map((symptom) => symptom.name);
  };

  const createSymptomRecord = (symptom: string): NewSymptomRecord | null => {
    try {
      if (geolocation.locationCoordinates.value === null) { // Changed here
        throw new Error("No location set");
      }
      if (apiData.value === null) {
        throw new Error("No pollen data");
      }

      const currentTime = createUTCDate();

      const currentTimeframe: Timeframe = {
        startTime: currentTime,
        endTime: addHours(createUTCDate(), 1),
      };

      const currentPollenData = filterPollenDataByTimeframe(
        apiData.value.records,
        currentTimeframe,
      );

      return {
        type: symptom,
        severity: symptomSeverity.value,
        timestamp: currentTime,
        location: {
          latitude: geolocation.locationCoordinates.value.latitude, // Changed here
          longitude: geolocation.locationCoordinates.value.longitude, // Changed here
        },
        pollenData: currentPollenData.map((record) => ({
          timestamp: new Date(record.timestamp.getTime()),
          levels: { ...record.levels },
        })),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("createSymptomRecord failed:", error.message);
      } else {
        const unknownErrorString = String(error);
        console.error(
          "createSymptomRecord failed: An unknown error occurred.",
          unknownErrorString,
        );
      }
      return null;
    }
  };

  const addSymptom = async (symptom: string): Promise<void> => {
    try {
      if (geolocation.locationCoordinates.value === null) { // Changed here
        throw new Error("No location set");
      }

      const newSymptomRecord = createSymptomRecord(symptom);

      if (newSymptomRecord === null) return;

      await db.symptoms.add(newSymptomRecord);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("addSymptom failed:", error.message);
      } else {
        const unknownErrorString = String(error);
        console.error(
          "addSymptom failed: An unknown error occurred.",
          unknownErrorString,
        );
      }
    }
  };

  const logSymptoms = async (): Promise<void> => {
    try {
      await Promise.all(selectedSymptoms.value.map(addSymptom));
      deselectAll();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("logSymptoms failed:", error.message);
      } else {
        const unknownErrorString = String(error);
        console.error(
          "logSymptoms failed: An unknown error occurred.",
          unknownErrorString,
        );
      }
    }
  };

  watch(
    geolocation.locationCoordinates,
    (newLocation) => {
      if (newLocation) {
        void openMeteoFetch({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        });
      }
    },
    { immediate: true },
  );

  return {
    noLocation,
    selectedSymptoms,
    symptomObjects,
    deselectAll,
    selectAll,
    logSymptoms,
  };
}
