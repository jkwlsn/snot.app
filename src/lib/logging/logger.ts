import type { LogEntry, LogLevel, LogProvider, Logger } from '$lib/types';

const rank: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

export function createLogger(provider: LogProvider, minLevel: LogLevel = 'info'): Logger {
	function emit(level: LogLevel, message: string, context?: LogEntry['context'], error?: Error) {
		if (rank[level] >= rank[minLevel]) {
			provider.log({ level, message, context, error, createdAt: new Date() });
		}
	}
	return {
		debug: (message: string, context?: LogEntry['context']) => emit('debug', message, context),
		info: (message: string, context?: LogEntry['context']) => emit('info', message, context),
		warn: (message: string, context?: LogEntry['context']) => emit('warn', message, context),
		error: (message: string, error?: Error, context?: LogEntry['context']) => {
			emit('error', message, context, error);
		}
	};
}
