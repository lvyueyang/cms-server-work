import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
import i18next from 'i18next';
import { ReactNode } from 'react';
import { getReqLang } from '@/common/lang.decorator';
import { ContentLang, FE_PREFIX } from '@/constants';
import { BaseLayout, ConfigProvider, DefaultLayout } from '@/views';
import { RenderViewInterceptor } from './render_view.interceptor';
import { RenderViewService } from './render_view.service';

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
  context: {
    switchToHttp(): HttpArgumentsHost;
  };
  private _lang?: ContentLang;

  constructor(options: RenderViewResultOptions) {
    this.title = options.title || '';
    this.description = options.description || '';
    this.meta = options.meta || {};
    this.styles = [`${FE_PREFIX}/common.css`, ...(options.styles || [])];
    this.scripts = [`${FE_PREFIX}/common.js`, ...(options.scripts || [])];
    this.render = options.render;
    this.layout = options.layout;
  }

  readonly _render = () => {
    const children = this.render(this);
    const ssrProps = this.getSSRProps();
    if (this.layout === 'base') {
      return (
        <ConfigProvider {...ssrProps}>
          <BaseLayout>{children}</BaseLayout>
        </ConfigProvider>
      );
    }
    return (
      <ConfigProvider {...ssrProps}>
        <DefaultLayout>{children}</DefaultLayout>
      </ConfigProvider>
    );
  };

  readonly useContext = (ctx: RenderViewResult['context']) => {
    this.context = ctx;
  };

  readonly getRequest = () => {
    return this.context.switchToHttp().getRequest<Request>() as Request;
  };

  readonly getResponse = () => {
    return this.context.switchToHttp().getResponse<Response>() as Response;
  };

  readonly getGlobalData = () => {
    return RenderViewService.getGlobalData(this.getLang());
  };

  readonly getSSRProps = () => {
    return {
      lang: this.getLang(),
      t: this.t,
      globalData: this.getGlobalData(),
      context: {
        getRequest: this.getRequest,
        getResponse: this.getResponse,
      },
    };
  };

  readonly getLang = () => {
    if (!this._lang) {
      this._lang = getReqLang(this.getRequest());
    }
    return this._lang;
  };

  // 国际化匹配方法
  readonly t = (...args: Parameters<typeof i18next.t>) => {
    const lang = this.getLang();
    const t = i18next.getFixedT(lang);
    return t(...args);
  };
}
