import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { InternalServerErrorPage } from "@cms/ssr/pages";
import { HttpAdapterHost } from "@nestjs/core";
import { CLS_KEYS, clsStore } from "@/common/cls.store";
import { LoggerService } from "@/modules/logger/logger.service";
import { RenderViewService } from "@/modules/render_view/render_view.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly logger: LoggerService,
		private readonly renderViewService: RenderViewService,
	) {}

	async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse();

		const httpStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(request),
			message:
				exception instanceof HttpException
					? exception.getResponse()
					: "Internal server error",
			traceId: clsStore.getStore()?.get(CLS_KEYS.TRACE_ID),
		};

		const message =
			exception instanceof Error ? exception.message : "Unknown error";
		const stack = exception instanceof Error ? exception.stack : undefined;
		this.logger.error(
			`Exception caught: ${message}`,
			stack,
			"AllExceptionsFilter",
		);

		if (request.path.startsWith("/api/") || httpStatus < 500) {
			httpAdapter.reply(response, responseBody, httpStatus);
			return;
		}

		await this.renderViewService.renderErrorPage(
			request,
			response,
			InternalServerErrorPage,
			HttpStatus.INTERNAL_SERVER_ERROR,
			"500",
			"页面渲染失败，请稍后重试。",
		);
	}
}
