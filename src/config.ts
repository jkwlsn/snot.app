export const DATABASE_NAME = "snotDB";

export const DATABASE_VERSION = 1;

export const SYMPTOM_LIST: string[] = [
  "Sneezing",
  "Snotty nose",
  "Sore throat",
  "Coughing",
  "Itchy eyes",
  "Headaches",
  "Tiredness",
];

// OPENMETEO
export const OPENMETEO_API_PARAMS = {
  retries: 3,
  backoffFactor: 0.2,
  backoffMax: 2,
};

export const OPENMETEO_POLLEN_TYPES = [
  "alder_pollen",
  "birch_pollen",
  "grass_pollen",
  "mugwort_pollen",
  "olive_pollen",
  "ragweed_pollen",
];

export const OPENMETEO_API_URL =
  "https://air-quality-api.open-meteo.com/v1/air-quality";

// Datetime
export const DATETIME_LOCAL_FORMAT = "YYYY-MM-DDTHH:mm";
