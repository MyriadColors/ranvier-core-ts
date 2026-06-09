import * as winston from 'winston';
import PrettyError from 'pretty-error';

const logExt = '.log';

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.simple()
			),
		}),
	],
});

/**
 * Wrapper around Winston
 */
export class Logger {
	static getLevel() {
		return logger.level;
	}

	static setLevel(level: string) {
		logger.level = level;
	}

	/*
    Medium priority logging, default.
  */
	static log(...messages: unknown[]) {
		logger.info(this._join(messages));
	}

	/*
    Appends red "ERROR" to the start of logs.
    Highest priority logging.
  */
	static error(...messages: unknown[]) {
		logger.error(this._join(messages));
	}

	/*
    Less high priority than error, still higher visibility than default.
  */
	static warn(...messages: unknown[]) {
		logger.warn(this._join(messages));
	}

	/*
    Lower priority logging.
    Only logs if the environment variable is set to VERBOSE.
  */
	static verbose(...messages: unknown[]) {
		logger.verbose(this._join(messages));
	}

	/**
	 * Safely join messages for logging
	 */
	private static _join(messages: unknown[]): string {
		return messages
			.map((m) => {
				if (typeof m === 'string') {
					return m;
				}
				if (m instanceof Error) {
					return m.stack || m.message;
				}
				try {
					return JSON.stringify(m);
				} catch {
					return String(m);
				}
			})
			.join(' ');
	}

	//TODO: Be able to set and deactivate file logging via a server command.
	static setFileLogging(path: string) {
		if (!path.endsWith(logExt)) {
			path += logExt;
		}
		console.log('Adding file logging at ' + path);
		logger.add(new winston.transports.File({ filename: path }));
	}

	static deactivateFileLogging() {
		const fileTransport = logger.transports.find(
			(t) => t instanceof winston.transports.File
		);
		if (fileTransport) {
			logger.remove(fileTransport);
		}
	}

	static enablePrettyErrors() {
		const pe = PrettyError.start();
		pe.skipNodeFiles(); // Ignore native node files in stacktrace.
	}

	static get _winston() {
		return logger;
	}
}
