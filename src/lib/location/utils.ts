export function isGeolocationPermissionError(err: unknown): err is Error & { code: number } {
	return (
		err instanceof Error &&
		(err.message.toLowerCase().includes('denied') ||
			('code' in err && (err as { code: number }).code === 1))
	);
}
