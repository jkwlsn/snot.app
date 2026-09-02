export function isGeolocationPermissionError(err: unknown): err is Error & { code: number } {
	return (
		err instanceof Error &&
		(err.message.toLowerCase().includes('denied') ||
			('code' in err && (err as { code: number }).code === 1))
	);
}

export function roundToPrecision(coord: number, decimals = 2): number {
	return Number(coord.toFixed(decimals));
}

export function roundTo1km(coord: number): number {
	return roundToPrecision(coord, 2);
}
