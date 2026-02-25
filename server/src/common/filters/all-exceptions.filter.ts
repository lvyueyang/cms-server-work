import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CLS_KEYS, clsStore } from '@/common/cls.store';
import { LoggerService } from '@/modules/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: exception instanceof HttpException ? exception.getResponse() : 'Internal server error',
      traceId: clsStore.getStore()?.get(CLS_KEYS.TRACE_ID),
    };

    // Log the error
    const message = exception instanceof Error ? exception.message : 'Unknown error';
    const stack = exception instanceof Error ? exception.stack : undefined;

    // Use logger.error
    this.logger.error(`Exception caught: ${message}`, stack, 'AllExceptionsFilter');

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
