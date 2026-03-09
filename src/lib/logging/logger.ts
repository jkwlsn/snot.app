import type { LogEntry, LogLevel, LogProvider } from './types';

export type Logger = ReturnType<typeof createLogger>;

const rank: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

export function createLogger(provider: LogProvider, minLevel: LogLevel = 'info') {
	function emit(level: LogLevel, message: string, context?: LogEntry['context'], error?: Error) {
		if (rank[level] >= rank[minLevel]) {
			provider.log({ level, message, context, error, timestamp: new Date() });
		}
	}
	return {
		debug: (message: string, context?: LogEntry['context']) => emit('debug', message, context),
		info: (message: string, context?: LogEntry['context']) => emit('info', message, context),
		warn: (message: string, context?: LogEntry['context']) => emit('warn', message, context),
		error: (message: string, context?: LogEntry['context'] & { error: Error }) => {
			const { error, ...rest } = context ?? {};
			emit('error', message, Object.keys(rest).length ? rest : undefined, error);
		}
	};
}
