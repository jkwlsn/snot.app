interface OpenMeteoAPIParams {
  latitude: number;
  longitude: number;
  hourly?: string[];
  timezone?: string;
  forecast_days?: number;
}

export type { OpenMeteoAPIParams };
