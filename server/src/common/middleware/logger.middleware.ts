import { randomUUID } from 'node:crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '@/modules/logger/logger.service';
import { CLS_KEYS, clsStore } from '../cls.store';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const traceId = (req.headers['x-request-id'] as string) || randomUUID();
    const context = new Map<string, any>();
    context.set(CLS_KEYS.TRACE_ID, traceId);

    clsStore.run(context, () => {
      const { method, originalUrl, ip } = req;
      const userAgent = req.get('user-agent') || '';
      const start = Date.now();

      this.logger.log(`Request started: ${method} ${originalUrl}`, 'HTTP');

      res.on('finish', () => {
        const { statusCode } = res;
        const duration = Date.now() - start;
        this.logger.log(
          `Request completed: ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${userAgent} - ${ip}`,
          'HTTP',
        );
      });

      next();
    });
  }
}
