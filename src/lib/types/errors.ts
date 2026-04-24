export interface AppError<T = unknown> extends Error {
	code: string;
	timestamp: Date;
	details?: T;
}
