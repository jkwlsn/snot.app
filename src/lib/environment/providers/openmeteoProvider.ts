import { fetchWeatherApi } from 'openmeteo';
import { format } from 'date-fns';
import { OPENMETEO_CONFIG } from './config';
import type { EnvironmentProvider, PollenType } from '../types';
import type { OpenMeteoProviderResponse } from './types';
import type { UserLocation } from '$lib/location';

export function createOpenmeteoProvider(): EnvironmentProvider<OpenMeteoProviderResponse> {
	return {
		supportedPollens: [...OPENMETEO_CONFIG.supportedPollenIds],

		getCurrent: async (pollenTypes: PollenType[], location: UserLocation) => {
			const responses = await fetchWeatherApi(OPENMETEO_CONFIG.url, {
				latitude: location.coordinates.latitude,
				longitude: location.coordinates.longitude,
				current: pollenTypes,
				timezone: 'auto'
			});

			const response = responses[0];
			if (!response) throw new Error('Open-Meteo: No response received');

			return { raw: response, pollenTypes };
		},

		getForecast: async (
			pollenTypes: PollenType[],
			location: UserLocation,
			from: Date,
			to: Date
		) => {
			const responses = await fetchWeatherApi(OPENMETEO_CONFIG.url, {
				latitude: location.coordinates.latitude,
				longitude: location.coordinates.longitude,
				hourly: pollenTypes,
				start_hour: format(from, "yyyy-MM-dd'T'HH:mm"),
				end_hour: format(to, "yyyy-MM-dd'T'HH:mm"),
				timezone: 'auto'
			});

			const response = responses[0];
			if (!response) throw new Error('Open-Meteo: No response received');

			return { raw: response, pollenTypes };
		}
	};
}
