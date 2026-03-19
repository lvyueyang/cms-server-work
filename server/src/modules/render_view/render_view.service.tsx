import { ExecutionContext, Injectable } from "@nestjs/common";
import i18next from "i18next";
import { isValidElement, ReactNode } from "react";
import { ContentLang } from "@/constants";
import { isDefaultI18nLang } from "@/utils";
import { BusinessConfig } from "../business_config/business_config.entity";
import { BusinessConfigService } from "../business_config/business_config.service";
import { LoggerService } from "../logger/logger.service";
import { SystemTranslationService } from "../system_translation/system_translation.service";

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

	constructor(
		private logger: LoggerService,
		private systemTranslationService: SystemTranslationService,
		private businessConfigService: BusinessConfigService,
	) {
		i18next.init({
			lng: ContentLang.ZH_CN,
			debug: false,
		});
		this.loadGlobal();
		this.loadI18n();
	}

	handler = (
		components: ReactNode,
		context: ExecutionContext,
	) => {
		
	};

	renderNotFoundPage = () => {
		return this.templateEngine.renderPageHtml({
			title: "404 Not Found",
			description: "页面不存在",
			content: this.templateEngine.render(
				<ErrorPage title="404 Not Found" message="页面不存在" />,
			),
		});
	};

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
				this.businessConfigService.findByCodes([
					"company_email",
					"company_tell",
					"company_address",
					"company_address_url",
					"custom_header_code",
					"custom_footer_code",
					"keywords",
					"i18n_enabled",
				]),
			]);

			const [system_config_en] = await Promise.all([
				this.businessConfigService.findByCodes(
					[
						"company_email",
						"company_tell",
						"company_address",
						"company_address_url",
						"custom_header_code",
						"custom_footer_code",
						"keywords",
						"i18n_enabled",
					],
					ContentLang.EN_US,
				),
			]);

			const getSystemContent = (
				list: BusinessConfig[],
				key: string,
				def = "",
			) => {
				return list.find((c) => c.code === key)?.content || def;
			};

			// 中文
			const globalData: GlobalData = {
				company_email: getSystemContent(system_config, "company_email"),
				company_tell: getSystemContent(system_config, "company_tell"),
				company_address: getSystemContent(system_config, "company_address"),
				company_address_url: getSystemContent(
					system_config,
					"company_address_url",
				),
				custom_header_code: getSystemContent(
					system_config,
					"custom_header_code",
				),
				custom_footer_code: getSystemContent(
					system_config,
					"custom_footer_code",
				),
				keywords: getSystemContent(system_config, "keywords"),
				i18n_enabled: getSystemContent(system_config, "i18n_enabled") === "1",
			};
			// 英文
			const enGlobalData: GlobalData = {
				company_email: getSystemContent(
					system_config_en,
					"company_email",
					globalData.company_email,
				),
				company_tell: getSystemContent(
					system_config_en,
					"company_tell",
					globalData.company_tell,
				),
				company_address: getSystemContent(
					system_config_en,
					"company_address",
					globalData.company_address,
				),
				company_address_url: getSystemContent(
					system_config_en,
					"company_address_url",
					globalData.company_address_url,
				),
				custom_header_code: getSystemContent(
					system_config_en,
					"custom_header_code",
					globalData.custom_header_code,
				),
				custom_footer_code: getSystemContent(
					system_config_en,
					"custom_footer_code",
					globalData.custom_footer_code,
				),
				keywords: getSystemContent(
					system_config_en,
					"keywords",
					globalData.keywords,
				),
				i18n_enabled:
					getSystemContent(system_config_en, "i18n_enabled") === "1",
			};
			RenderViewService.globalDataI18n = {
				[ContentLang.ZH_CN]: globalData,
				[ContentLang.EN_US]: enGlobalData,
			};
		} catch (e) {
			console.error("加载全局数据失败: ", e);
			this.logger.error("加载全局数据失败", e?.toString());
		}
	}

	// 加载国际化数据
	async loadI18n() {
		const locals = await this.systemTranslationService.findAll();
		const localsEn = locals.filter((item) => item.lang === ContentLang.EN_US);
		const localsZh = locals.filter((item) => item.lang === ContentLang.ZH_CN);
		const en = transI18n(localsEn);
		const zh = transI18n(localsZh);
		i18next.addResourceBundle(ContentLang.EN_US, "translation", en);
		i18next.addResourceBundle(ContentLang.ZH_CN, "translation", zh);
	}
}

function transI18n(list: { key: string; value: string }[]) {
	const obj: Record<string, string> = {};
	list.forEach((item) => {
		obj[item.key] = item.value;
	});
	return obj;
}
