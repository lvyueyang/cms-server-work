import { ConsoleLogger, Injectable } from "@nestjs/common";
import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { CLS_KEYS, clsStore } from "@/common/cls.store";
import { getLogDirPath } from "@/utils";

@Injectable()
export class LoggerService extends ConsoleLogger {
	private winstonLogger: winston.Logger;

	constructor(context?: string) {
		super(context ?? "");
		this.initWinston();
	}

	private initWinston() {
		const logDir = getLogDirPath();
		const { combine, timestamp, json, printf, colorize, errors } =
			winston.format;

		const logFormat = printf(
			({ level, message, timestamp, stack, context, traceId, ...meta }) => {
				const ctx = context ? `[${context}]` : "";
				const tid = traceId ? `[TraceID: ${traceId}]` : "";
				const msg = stack || message;
				return `${timestamp} ${level} ${ctx}${tid}: ${msg} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
			},
		);

		// Filter for HTTP requests
		const httpFilter = winston.format((info) => {
			return info.context === "HTTP" ? info : false;
		});

		// Filter for Application logs (exclude HTTP requests)
		const appFilter = winston.format((info) => {
			return info.context !== "HTTP" ? info : false;
		});

		this.winstonLogger = winston.createLogger({
			level: process.env.LOG_LEVEL || "info",
			format: combine(
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				errors({ stack: true }),
				json(),
			),
			defaultMeta: { service: "cms-server" },
			transports: [
				// Error logs
				new DailyRotateFile({
					filename: `${logDir}/%DATE%/error.log`,
					datePattern: "YYYY-MM-DD",
					level: "error",
					maxSize: "20m",
					maxFiles: "14d",
					zippedArchive: true, // Enable gzip compression
				}),
				// Warn logs
				new DailyRotateFile({
					filename: `${logDir}/%DATE%/warn.log`,
					datePattern: "YYYY-MM-DD",
					level: "warn",
					maxSize: "20m",
					maxFiles: "14d",
					zippedArchive: true, // Enable gzip compression
				}),
				// HTTP Access logs (New)
				new DailyRotateFile({
					filename: `${logDir}/%DATE%/access.log`,
					datePattern: "YYYY-MM-DD",
					level: "info",
					maxSize: "20m",
					maxFiles: "14d",
					zippedArchive: true, // Enable gzip compression
					format: combine(httpFilter(), json()), // Only HTTP logs
				}),
				// Combined logs (Business logic only, exclude HTTP)
				new DailyRotateFile({
					filename: `${logDir}/%DATE%/combined.log`,
					datePattern: "YYYY-MM-DD",
					maxSize: "10m", // Reduced size for easier viewing
					maxFiles: "14d",
					zippedArchive: true, // Enable gzip compression
					format: combine(appFilter(), json()), // Exclude HTTP logs
				}),
			],
		});

		// Add console transport for development
		if (process.env.NODE_ENV !== "production") {
			this.winstonLogger.add(
				new winston.transports.Console({
					format: combine(
						colorize(),
						timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
						logFormat,
					),
				}),
			);
		}
	}

	private getTraceId(): string | undefined {
		const store = clsStore.getStore();
		return store?.get(CLS_KEYS.TRACE_ID);
	}

	log(message: any, context?: string) {
		const traceId = this.getTraceId();
		super.log(message, context);
		this.winstonLogger.info(message, {
			context: context || this.context,
			traceId,
		});
	}

	error(message: any, stack?: string, context?: string) {
		const traceId = this.getTraceId();
		super.error(message, stack, context);
		this.winstonLogger.error(message, {
			stack,
			context: context || this.context,
			traceId,
		});
	}

	warn(message: any, context?: string) {
		const traceId = this.getTraceId();
		super.warn(message, context);
		this.winstonLogger.warn(message, {
			context: context || this.context,
			traceId,
		});
	}

	debug(message: any, context?: string) {
		const traceId = this.getTraceId();
		super.debug(message, context);
		this.winstonLogger.debug(message, {
			context: context || this.context,
			traceId,
		});
	}

	verbose(message: any, context?: string) {
		const traceId = this.getTraceId();
		super.verbose(message, context);
		this.winstonLogger.verbose(message, {
			context: context || this.context,
			traceId,
		});
	}
}
