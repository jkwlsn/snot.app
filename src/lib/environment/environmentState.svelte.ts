import { OPENMETEO_CONFIG } from "./providers/config";
import { addHoursUTC, getUTCNow, type UTCDate } from "$lib/date";
import { getLoggingService } from "$lib/logging";
import type { LocationState, UserLocation } from "$lib/location";
import type {
  PollenType,
  EnvironmentService,
  EnvironmentState,
  CurrentEnvironment,
  ForecastEnvironment,
} from "./types";

export function createEnvironmentState({
  service,
  locationState,
  pollenTypes,
}: {
  service: EnvironmentService;
  locationState: LocationState;
  pollenTypes?: PollenType[];
}): EnvironmentState {
  const logger = getLoggingService();
  const supportedPollenTypes = service.getSupportedPollenTypes();
  const now = getUTCNow();

  let selectedPollenTypes = $state<PollenType[]>(pollenTypes ?? supportedPollenTypes);

  // Inferred types for internal state allow mutation
  const current = $state({
    location: null as UserLocation | null,
    isLoading: false,
    error: null as Error | null,
    data: undefined as CurrentEnvironment | undefined,
    lastUpdated: null as UTCDate | null,
  });

  const forecast = $state({
    location: null as UserLocation | null,
    isLoading: false,
    error: null as Error | null,
    from: now,
    to: addHoursUTC(now, OPENMETEO_CONFIG.maxForecastDays * 24),
    data: undefined as ForecastEnvironment | undefined,
    lastUpdated: null as UTCDate | null,
    timezone: undefined as string | undefined,
  });

  $effect(() => {
    const location = locationState.currentLocation;
    const pollen = supportedPollenTypes;

    if (!location) {
      current.data = undefined;
      current.location = null;
      current.lastUpdated = null;
      return;
    }

    current.isLoading = true;
    current.error = null;
    current.location = location;

    service
      .getCurrentPollen(pollen, location)
      .then((data) => {
        current.data = data;
        current.lastUpdated = getUTCNow();
      })
      .catch((err) => {
        current.error = err instanceof Error ? err : new Error(String(err));
      })
      .finally(() => {
        current.isLoading = false;
      });
  });

  $effect(() => {
    const location = locationState.currentLocation;
    const pollen = supportedPollenTypes;

    if (!location) {
      forecast.data = undefined;
      forecast.location = null;
      forecast.lastUpdated = null;
      forecast.timezone = undefined;
      return;
    }

    forecast.isLoading = true;
    forecast.error = null;
    forecast.location = location;

    service
      .getForecastPollen(pollen, location, forecast.from, forecast.to)
      .then((data) => {
        forecast.data = data;
        forecast.lastUpdated = getUTCNow();
        forecast.timezone = data.timezone;
        logger.debug("DEBUG: Fetched data from date:", {
          fromISO: data.observations[0].createdAt.toISOString(),
          timezone: data.timezone,
        });
      })
      .catch((err) => {
        forecast.error = err instanceof Error ? err : new Error(String(err));
      })
      .finally(() => {
        forecast.isLoading = false;
      });
  });

  return {
    get supportedPollenTypes() {
      return supportedPollenTypes;
    },
    get selectedPollenTypes() {
      return selectedPollenTypes;
    },
    get current() {
      return current;
    },
    get forecast() {
      return forecast;
    },
    setSelectedPollenTypes(types: PollenType[]) {
      selectedPollenTypes = types;
    },
    togglePollenType(pollenId: PollenType) {
      const index = selectedPollenTypes.indexOf(pollenId);
      if (index > -1) {
        selectedPollenTypes.splice(index, 1);
      } else {
        selectedPollenTypes.push(pollenId);
      }
    },
    setForecastRange(newFrom: UTCDate, newTo: UTCDate) {
      forecast.from = newFrom;
      forecast.to = newTo;
    },
  } satisfies EnvironmentState;
}
