import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { TEMPLATE_NAME_METADATA } from './render_view.constant';
import { RenderViewInterceptor } from './render_view.interceptor';

export function RenderView(template: string) {
  return applyDecorators(
    SetMetadata(TEMPLATE_NAME_METADATA, template),
    UseInterceptors(RenderViewInterceptor),
  );
}
