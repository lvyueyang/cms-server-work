import { ExecutionContext, UseInterceptors, applyDecorators } from '@nestjs/common';
import { RenderViewInterceptor } from './render_view.interceptor';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ReactNode } from 'react';
import { Request, Response } from 'express';
import { ContentLang } from '@/constants';
import { getReqLang } from '@/common/lang.decorator';
import i18next from 'i18next';
import { BaseLayout } from './components/BaseLayout';

export { BaseLayout };
export type LayoutType = 'base';

export function RenderView() {
  return applyDecorators(UseInterceptors(RenderViewInterceptor), ApiExcludeEndpoint());
}

export interface RenderViewResultContext {
  req: Request;
  res: Response;
}

type RenderViewResultOptions = Pick<
  RenderViewResult,
  'title' | 'description' | 'meta' | 'styles' | 'layout' | 'scripts' | 'render'
>;

/** 渲染页面的数据 */
export class RenderViewResult {
  /** 布局 */
  layout?: LayoutType;
  /** 页面标题 */
  title?: string;
  /** 页面描述 */
  description?: string;
  /** 页面元数据 */
  meta?: Record<string, string>;
  styles?: string[];
  scripts?: string[];
  render: (ctx: RenderViewResult) => ReactNode;
  context: ExecutionContext;
  private _lang?: ContentLang;

  constructor(options: RenderViewResultOptions) {
    this.title = options.title || '';
    this.description = options.description || '';
    this.meta = options.meta || {};
    this.styles = ['/_fe_/common.css', ...(options.styles || [])];
    this.scripts = ['/_fe_/common.js', ...(options.scripts || [])];
    this.render = options.render;
    this.layout = options.layout;
  }

  _render = () => {
    console.log('this.layout: ', this.layout);
    const children = this.render(this);
    if (this.layout === 'base') {
      return <BaseLayout>{children}</BaseLayout>;
    }
    return children;
  };

  useContext = (ctx: ExecutionContext) => {
    this.context = ctx;
  };

  getRequest = () => {
    return this.context.switchToHttp().getRequest<Request>() as Request;
  };

  getResponse = () => {
    return this.context.switchToHttp().getResponse<Response>() as Response;
  };

  getLayout = (type: LayoutType): React.FC<{ children?: ReactNode }> | null => {
    if (type === 'base') {
      const Comp: React.FC = (children: ReactNode) => <BaseLayout>{children}</BaseLayout>;
      return Comp;
    }
    return null;
  };

  getLang = () => {
    if (!this._lang) {
      this._lang = getReqLang(this.getRequest());
    }
    return this._lang;
  };

  // 国际化匹配方法
  t = (...args: Parameters<typeof i18next.t>) => {
    const lang = this.getLang();
    const t = i18next.getFixedT(lang);
    return t(...args);
  };
}
