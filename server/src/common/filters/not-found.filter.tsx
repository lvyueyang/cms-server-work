import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	NotFoundException,
} from "@nestjs/common";
import { NotFoundPage } from "@cms/ssr/pages";
import { Request, Response } from "express";
import { RenderViewService } from "@/modules/render_view/render_view.service";

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
	constructor(private readonly renderViewService: RenderViewService) {}

	async catch(exception: NotFoundException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		if (request.path.startsWith("/api/")) {
			response.status(status).json({
				statusCode: status,
				message: exception.message,
				error: "Not Found",
			});
			return;
		}

		await this.renderViewService.renderErrorPage(
			request,
			response,
			NotFoundPage,
			status,
			"404",
			"页面不存在或已经被移除。",
		);
	}
}
