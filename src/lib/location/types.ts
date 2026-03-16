// Describes where the LocationCoordinatescame from: gps or manual
export type LocationSource = 'gps' | 'manual';
//
// Used for location coordinates
export interface LocationCoordinates {
	lat: number;
	lon: number;
}

// Describes a single location
export interface Location {
	label: string;
	coordinates: LocationCoordinates;
}

// Describe provider interfaces
export interface GeolocationProvider {
	getCurrentPosition(): Promise<LocationCoordinates>;
}

export interface GeocodeProvider {
	forward(query: string): Promise<Location[]>;
	reverse(coordinates: LocationCoordinates): Promise<Location>;
}
