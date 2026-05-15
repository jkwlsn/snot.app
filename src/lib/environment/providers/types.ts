import type { PollenType } from '../types';
import type { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';

// Open Meteo types
export interface OpenMeteoProviderResponse {
	raw: WeatherApiResponse;
	pollenTypes: PollenType[];
}
