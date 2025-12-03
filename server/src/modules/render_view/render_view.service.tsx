import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorPage, ReactTemplateEngine } from './render_view.engine';
import { RenderViewResult } from './render_view.decorator';
import { isValidElement } from 'react';
import i18next from 'i18next';
import { SystemTranslationService } from '../system_translation/system_translation.service';
import { ContentLang } from '@/constants';
interface GlobalData {
  siteName: string;
  version: string;
}

@Injectable()
export class RenderViewService {
  static globalData: GlobalData = {} as GlobalData;
  private templateEngine: ReactTemplateEngine;

  constructor(
    private configService: ConfigService,
    private systemTranslationService: SystemTranslationService,
  ) {
    i18next.init({
      lng: ContentLang.ZH_CN,
      debug: false,
    });
    this.loadGlobal();
    this.templateEngine = new ReactTemplateEngine();
    this.loadI18n();
  }

  async handler(renderCtx: RenderViewResult, context: ExecutionContext) {
    renderCtx.useContext(context);
    const jsxElement = renderCtx?._render();
    try {
      // 检查是否返回了JSX组件（React元素）
      let htmlContent = '';
      if (isValidElement(jsxElement)) {
        // 直接渲染JSX组件
        htmlContent = this.templateEngine.renderJSX(jsxElement);
      } else if (typeof jsxElement === 'string') {
        htmlContent = jsxElement;
      } else {
        htmlContent = this.templateEngine.render(
          <ErrorPage title="渲染错误" message="页面渲染时返回了无效的内容" />,
        );
      }

      // 包装在布局中
      const html = this.templateEngine.renderPageHtml({
        title: renderCtx?.title,
        description: renderCtx.description,
        styles: renderCtx.styles,
        scripts: renderCtx.scripts,
        meta: renderCtx.meta,
        content: htmlContent,
        lang: renderCtx.getLang(),
      });
      return html;
    } catch (error) {
      console.error('Page render error:', error);
      const errorHtml = await this.templateEngine.renderPageHtml({
        title: '错误',
        description: '',
        content: this.templateEngine.render(
          <ErrorPage title="服务器错误" message="抱歉，页面渲染时发生了错误" />,
        ),
      });
      return errorHtml;
    }
  }

  async loadGlobal() {
    // 可以在这里加载全局数据，比如菜单、配置等
    RenderViewService.globalData = {
      siteName: 'CMS系统',
      version: '1.0.0',
    };
  }

  // 加载国际化数据
  async loadI18n() {
    const locals = await this.systemTranslationService.findAll();
    const localsEn = locals.filter((item) => item.lang === ContentLang.EN_US);
    const localsZh = locals.filter((item) => item.lang === ContentLang.ZH_CN);
    const en = transI18n(localsEn);
    const zh = transI18n(localsZh);
    i18next.addResourceBundle(ContentLang.EN_US, 'translation', en);
    i18next.addResourceBundle(ContentLang.ZH_CN, 'translation', zh);
  }
}

function transI18n(list: { key: string; value: string }[]) {
  const obj: Record<string, string> = {};
  list.forEach((item) => {
    obj[item.key] = item.value;
  });
  return obj;
}
