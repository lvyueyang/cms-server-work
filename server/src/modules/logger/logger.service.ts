import { ConsoleLogger } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { getLogDirPath } from '@/utils';

export class LoggerService extends ConsoleLogger {
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new DailyRotateFile({
        filename: `${getLogDirPath()}/%DATE%/error.log`,
        datePattern: 'YYYY-MM-DD',
        level: 'error',
      }),
      // new DailyRotateFile({
      //   filename: log_dir + '/%DATE%/warn.log',
      //   datePattern: 'YYYY-MM-DD',
      //   level: 'warn',
      // }),
      // new DailyRotateFile({
      //   filename: log_dir + '/%DATE%/combined.log',
      //   datePattern: 'YYYY-MM-DD',
      // }),
    ],
  });

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.logger.error(message, { trace, context });
  }

  // warn(message: any, context?: string) {
  //   super.warn(message, context);
  //   this.logger.warn(message, { context });
  // }

  log(message: any, context?: string) {
    super.log(message, context);
    this.logger.info(message, { context });
  }
}
