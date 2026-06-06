import { getPollenColor } from '../utils/pollen';
import type { PollenType } from '../types';

export function toPollenGraphSeries(selectedTypes: PollenType[]) {
	return selectedTypes.map((id) => ({
		key: id,
		color: getPollenColor(id),
		strokeWidth: 2
	}));
}
