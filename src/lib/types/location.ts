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
