import { Get, UseInterceptors, applyDecorators } from '@nestjs/common';
import { RenderViewInterceptor } from './render_view.interceptor';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ReactNode } from 'react';

export { BaseLayout, getBaseLayout } from './render_view.engine';

export function RenderView() {
  return applyDecorators(UseInterceptors(RenderViewInterceptor), ApiExcludeEndpoint());
}

/** 渲染页面的数据 */
export class RenderViewResult {
  /** 页面标题 */
  title?: string;
  /** 页面描述 */
  description?: string;
  /** 页面元数据 */
  meta?: Record<string, string>;
  styles?: string[];
  scripts?: string[];
  render: () => ReactNode;

  constructor(options: RenderViewResult) {
    this.title = options.title || '';
    this.description = options.description || '';
    this.meta = options.meta || {};
    this.styles = options.styles || [];
    this.scripts = options.scripts || [];
    this.render = options.render;
  }
}
