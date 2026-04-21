import type { LocationCoordinates, UserLocation } from '$lib/types';

// Describe provider interfaces
export interface GeolocationProvider {
	getCurrentPosition(): Promise<LocationCoordinates>;
}

export interface GeocodeProvider {
	forward(query: string): Promise<UserLocation[]>;
	reverse(coordinates: LocationCoordinates): Promise<UserLocation>;
}

export interface LocationService {
	getBrowserLocation(): Promise<UserLocation | null>;
	forwardGeocode(query: string): Promise<UserLocation[]>;
	reverseGeocode(coordinates: LocationCoordinates): Promise<UserLocation | null>;
}
