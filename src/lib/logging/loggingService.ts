import type { LogLevel, LoggingService, LoggingServiceOptions, LogContext } from './types';

const rank: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

export function createLoggingService({
	provider,
	minLevel = 'info'
}: LoggingServiceOptions): LoggingService {
	function emit(level: LogLevel, message: string, context?: LogContext, error?: Error) {
		if (rank[level] >= rank[minLevel]) {
			provider.log({ level, message, context, error, createdAt: new Date() });
		}
	}
	return {
		debug: (message: string, context?: LogContext) => emit('debug', message, context),
		info: (message: string, context?: LogContext) => emit('info', message, context),
		warn: (message: string, context?: LogContext) => emit('warn', message, context),
		error: (message: string, error?: Error, context?: LogContext) => {
			emit('error', message, context, error);
		}
	};
}
