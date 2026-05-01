export interface LocationCoordinates {
	latitude: number;
	longitude: number;
}

export interface UserLocation {
	label: string;
	coordinates: LocationCoordinates;
}

export interface WithLocation {
	location: UserLocation | null;
}

export interface LocationState {
	currentLocation: UserLocation | null;
	searchResults: UserLocation[];
}

export interface GeolocationProvider {
	getCurrentPosition(): Promise<LocationCoordinates>;
}

export interface GeocodeProvider {
	forward(query: string): Promise<UserLocation[]>;
	reverse(coordinates: LocationCoordinates): Promise<UserLocation>;
}

export interface LocationService {
	getBrowserLocation(): Promise<UserLocation>;
	forwardGeocode(query: string): Promise<UserLocation[]>;
	reverseGeocode(coordinates: LocationCoordinates): Promise<UserLocation>;
}
