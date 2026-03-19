import { SYMPTOMS, type SymptomName } from '$lib/config';
import type { SymptomRecord } from '$lib/types';
import type { GeoDataPoint, GeoGraph } from '../types';
import type { LocationCoordinates } from '$lib/location/types';

const toLocationKey = ({ latitude, longitude }: LocationCoordinates) =>
	`${latitude.toFixed(1)},${longitude.toFixed(1)}`;

const severityOf = (record: SymptomRecord) =>
	SYMPTOMS.reduce((acc, symptom) => acc + record[symptom.name as SymptomName], 0);

export const createLayerchartGeoGraph: GeoGraph = {
	transform(records): GeoDataPoint[] {
		const byLocation = records
			.filter(
				(record) =>
					record.location?.coordinates !== null && record.location?.coordinates !== undefined
			)
			.reduce((acc, record) => {
				const key = toLocationKey(record.location!.coordinates);
				const current = acc.get(key) ?? {
					latitude: record.location!.coordinates.latitude,
					longitude: record.location!.coordinates.longitude,
					sum: 0,
					count: 0
				};
				return (
					acc.set(key, {
						...current,
						sum: current.sum + severityOf(record),
						count: current.count + 1
					}),
					acc
				);
			}, new Map<string, { latitude: number; longitude: number; sum: number; count: number }>());

		return Array.from(byLocation.values()).map(({ latitude, longitude, sum, count }) => ({
			latitude,
			longitude,
			value: sum / count,
			count
		}));
	}
};
