import { browserGeolocationProvider } from './providers/browserGeolocation';
import { nominatimGeocodeProvider } from './providers/nominatimGeocodeProvider';
import { createLocationService } from './service';

export const locationService = createLocationService({
	geolocation: browserGeolocationProvider(),
	geocode: nominatimGeocodeProvider()
});
