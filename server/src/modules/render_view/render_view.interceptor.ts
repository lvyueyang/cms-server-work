import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TEMPLATE_NAME_METADATA } from './render_view.constant';
import { Request, Response } from 'express';
import { RenderViewService } from './render_view.service';

@Injectable()
export class RenderViewInterceptor implements NestInterceptor {
  constructor(
    private renderViewService: RenderViewService,
    private reflector: Reflector,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest() as Request;
    const res = context.switchToHttp().getResponse() as Response;
    const handler = context.getHandler();
    const template = this.reflector.get<string>(TEMPLATE_NAME_METADATA, handler);

    return next.handle().pipe(
      map(async (context) => {
        return await this.renderViewService.handler(req, res, context);
      }),
    );
  }
}
