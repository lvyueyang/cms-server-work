import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

    return next.handle().pipe(
      switchMap(async (context) => {
        return await this.renderViewService.handler(req, res, context);
      }),
    );
  }
}
