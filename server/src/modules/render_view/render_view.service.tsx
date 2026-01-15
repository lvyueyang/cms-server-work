import { Injectable } from '@nestjs/common';
import i18next from 'i18next';
import { isValidElement } from 'react';
import { ContentLang } from '@/constants';
import { isDefaultI18nLang } from '@/utils';
import { ContentTranslationService } from '../content_translation/content_translation.service';
import { DictValueService } from '../dict_value/dict_value.service';
import { LoggerService } from '../logger/logger.service';
import { SystemConfig } from '../system_config/system_config.entity';
import { SystemConfigService } from '../system_config/system_config.service';
import { SystemTranslationService } from '../system_translation/system_translation.service';
import { RenderViewResult } from './render_view.decorator';
import { ErrorPage, ReactTemplateEngine } from './render_view.engine';
export interface GlobalData {
  company_email: string;
  company_tell: string;
  company_address: string;
  company_address_url: string;
  custom_header_code: string;
  custom_footer_code: string;
  i18n_enabled: boolean;
  keywords: string;
}

@Injectable()
export class RenderViewService {
  static globalDataI18n = {} as Record<ContentLang, GlobalData>;
  public templateEngine: ReactTemplateEngine;

  constructor(
    private logger: LoggerService,
    private systemTranslationService: SystemTranslationService,
    private systemConfigService: SystemConfigService,
    private contentTranslationService: ContentTranslationService
  ) {
    i18next.init({
      lng: ContentLang.ZH_CN,
      debug: false,
    });
    this.loadGlobal();
    this.templateEngine = new ReactTemplateEngine();
    this.loadI18n();
  }

  handler = (renderCtx: RenderViewResult, context: RenderViewResult['context']) => {
    renderCtx.useContext(context);
    const jsxElement = renderCtx?._render();
    const t = renderCtx.t;
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
          <ErrorPage
            title="渲染错误"
            message="页面渲染时返回了无效的内容"
          />
        );
      }

      const lang = renderCtx.getLang();
      const { custom_header_code, custom_footer_code } = this.getGlobalData(lang);

      // 包装在布局中
      const html = this.templateEngine.renderPageHtml({
        title: `${t(renderCtx?.title || '')} - ${t('xxxx')}`,
        description: renderCtx.description,
        styles: renderCtx.styles,
        scripts: renderCtx.scripts,
        meta: renderCtx.meta,
        content: htmlContent,
        lang: renderCtx.getLang(),
        globalHeader: custom_header_code,
        globalFooter: custom_footer_code,
        keywords: this.getGlobalData(lang).keywords,
        header: `<script>
          window.lang = "${lang}";
        </script>`,
      });
      return html;
    } catch (error) {
      console.error('Page render error:', error);
      const errorHtml = this.templateEngine.renderPageHtml({
        title: '错误',
        description: '',
        content: this.templateEngine.render(
          <ErrorPage
            title="服务器错误"
            message="抱歉，页面渲染时发生了错误"
          />
        ),
      });
      return errorHtml;
    }
  };

  renderNotFoundPage = () => {
    return this.templateEngine.renderPageHtml({
      title: '404 Not Found',
      description: '页面不存在',
      content: this.templateEngine.render(
        <ErrorPage
          title="404 Not Found"
          message="页面不存在"
        />
      ),
    });
  };

  async render(jsxElement: React.ReactNode) {
    let htmlContent = '';
    if (isValidElement(jsxElement)) {
      // 直接渲染JSX组件
      htmlContent = this.templateEngine.renderJSX(jsxElement);
    } else if (typeof jsxElement === 'string') {
      htmlContent = jsxElement;
    } else {
      htmlContent = this.templateEngine.render(
        <ErrorPage
          title="渲染错误"
          message="页面渲染时返回了无效的内容"
        />
      );
    }
    return htmlContent;
  }

  static getGlobalData = (lang: ContentLang): GlobalData => {
    if (isDefaultI18nLang(lang)) {
      return RenderViewService.globalDataI18n[ContentLang.ZH_CN];
    }
    return RenderViewService.globalDataI18n[lang];
  };

  getGlobalData(lang: ContentLang) {
    return RenderViewService.globalDataI18n[lang];
  }

  async loadGlobal() {
    try {
      const [system_config] = await Promise.all([
        // 系统字段
        this.systemConfigService.findByCodes([
          'company_email',
          'company_tell',
          'company_address',
          'company_address_url',
          'custom_header_code',
          'custom_footer_code',
          'keywords',
          'i18n_enabled',
        ]),
      ]);

      const [system_config_en] = await Promise.all([
        this.contentTranslationService.overlayTranslations(system_config, {
          entity: SystemConfigService.I18N_KEY,
          fields: SystemConfigService.I18N_FIELDS,
          lang: ContentLang.EN_US,
        }),
      ]);

      const getSystemContent = (list: SystemConfig[], key: string, def = '') => {
        return list.find((c) => c.code === key)?.content || def;
      };

      // 中文
      const globalData: GlobalData = {
        company_email: getSystemContent(system_config, 'company_email'),
        company_tell: getSystemContent(system_config, 'company_tell'),
        company_address: getSystemContent(system_config, 'company_address'),
        company_address_url: getSystemContent(system_config, 'company_address_url'),
        custom_header_code: getSystemContent(system_config, 'custom_header_code'),
        custom_footer_code: getSystemContent(system_config, 'custom_footer_code'),
        keywords: getSystemContent(system_config, 'keywords'),
        i18n_enabled: getSystemContent(system_config, 'i18n_enabled') === '1',
      };
      // 英文
      const enGlobalData: GlobalData = {
        company_email: getSystemContent(system_config_en, 'company_email', globalData.company_email),
        company_tell: getSystemContent(system_config_en, 'company_tell', globalData.company_tell),
        company_address: getSystemContent(system_config_en, 'company_address', globalData.company_address),
        company_address_url: getSystemContent(system_config_en, 'company_address_url', globalData.company_address_url),
        custom_header_code: getSystemContent(system_config_en, 'custom_header_code', globalData.custom_header_code),
        custom_footer_code: getSystemContent(system_config_en, 'custom_footer_code', globalData.custom_footer_code),
        keywords: getSystemContent(system_config_en, 'keywords', globalData.keywords),
        i18n_enabled: getSystemContent(system_config_en, 'i18n_enabled') === '1',
      };
      RenderViewService.globalDataI18n = {
        [ContentLang.ZH_CN]: globalData,
        [ContentLang.EN_US]: enGlobalData,
      };
    } catch (e) {
      console.error('加载全局数据失败: ', e);
      this.logger.error('加载全局数据失败', e?.toString());
    }
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
