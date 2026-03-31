import { InternalServerErrorPage } from "@cms/ssr/pages";
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { CLS_KEYS, clsStore } from "@/common/cls.store";
import { LoggerService } from "@/modules/logger/logger.service";
import { RenderViewService } from "@/modules/render_view/render_view.service";

const IGNORED_NOT_FOUND_PATHS = new Set<string>([
	"/.well-known/appspecific/com.chrome.devtools.json",
]);

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
		const requestPath = responseBody.path;
		const requestMethod =
			typeof request?.method === "string" ? request.method : "UNKNOWN";
		if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
			this.logger.error(
				`Exception caught [${requestMethod} ${requestPath}]: ${message}`,
				stack,
				"AllExceptionsFilter",
			);
		} else if (
			httpStatus === HttpStatus.NOT_FOUND &&
			IGNORED_NOT_FOUND_PATHS.has(requestPath)
		) {
			this.logger.warn(
				`Ignored not found probe: ${requestMethod} ${requestPath}`,
				"AllExceptionsFilter",
			);
		} else {
			this.logger.warn(
				`Client exception [${httpStatus}] ${requestMethod} ${requestPath}: ${message}`,
				"AllExceptionsFilter",
			);
		}

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
