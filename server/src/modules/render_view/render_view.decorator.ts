import { Get, UseInterceptors, applyDecorators } from '@nestjs/common';
import { RenderViewInterceptor } from './render_view.interceptor';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

export function RenderView(path: string) {
  const paths = [];
  // 必须对path添加 /_next/data 处理，否则无法进行页内跳转
  const nextUrl = `/_next/data/:key${path}.json`;
  paths.push(path, nextUrl);
  return applyDecorators(
    // SetMetadata(TEMPLATE_NAME_METADATA, template),
    Get(paths),
    UseInterceptors(RenderViewInterceptor),
    ApiExcludeEndpoint(),
  );
}
