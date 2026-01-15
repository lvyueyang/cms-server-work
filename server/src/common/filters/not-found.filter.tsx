import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { RenderViewResult } from '@/modules/render_view/render_view.decorator';
import { RenderViewService } from '@/modules/render_view/render_view.service';
import { NotFoundPage } from '@/views';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  constructor(private readonly renderViewService: RenderViewService) {}
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (request.path.startsWith('/api/')) {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: 'Not Found',
      });
    } else {
      const viewResult = new RenderViewResult({
        title: '404',
        layout: 'base',
        render: () => <NotFoundPage />,
      });
      const htmlContent = this.renderViewService.handler(viewResult, host);
      response.status(status).write(htmlContent);
      response.end();
    }
  }
}
