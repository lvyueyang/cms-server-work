import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RenderViewService } from './render_view.service';

@Injectable()
export class RenderViewInterceptor implements NestInterceptor {
  constructor(private renderViewService: RenderViewService, private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap(async (data) => {
        return await this.renderViewService.handler(data, context);
      })
    );
  }
}
