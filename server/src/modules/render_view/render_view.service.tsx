import { dirname, join } from "node:path";
import { ExecutionContext, Injectable } from "@nestjs/common";
import type {
	GlobalData,
	PageAssetManifest,
	PageComponentProps,
	SsrBootstrapPayload,
	SsrPageComponent,
} from "@cms/ssr/server";
import { AppProvider, HtmlDocument } from "@cms/ssr/server";
import { renderToPipeableStream } from "react-dom/server";
import { getReqLang } from "@/common/lang.decorator";
import { ContentLang } from "@/constants";
import { isDefaultI18nLang } from "@/utils";
import { AuthService } from "../auth/auth.service";
import { BusinessConfig } from "../business_config/business_config.entity";
import { BusinessConfigService } from "../business_config/business_config.service";
import { LoggerService } from "../logger/logger.service";
import { SystemTranslationService } from "../system_translation/system_translation.service";

const SSR_PACKAGE_DIR = dirname(require.resolve("@cms/ssr/package.json"));
const SSR_MANIFEST_PATH = join(SSR_PACKAGE_DIR, "dist/web/manifest.json");

interface RenderOptions {
	statusCode?: number;
	title?: string;
	description?: string;
}

@Injectable()
export class RenderViewService {
	private globalDataI18n = {} as Record<ContentLang, GlobalData>;
	private translationsI18n = {} as Record<ContentLang, Record<string, string>>;
	private cachedAssets: PageAssetManifest | null = null;

	constructor(
		private readonly logger: LoggerService,
		private readonly systemTranslationService: SystemTranslationService,
		private readonly businessConfigService: BusinessConfigService,
		private readonly authService: AuthService,
	) {
		void this.loadGlobal();
		void this.loadI18n();
	}

	async renderPage(
		context: ExecutionContext,
		pageComponent: SsrPageComponent<any>,
		pageData: unknown,
		options?: RenderOptions,
	) {
		const http = context.switchToHttp();
		const req = http.getRequest();
		const res = http.getResponse();
		return this.render(req, res, pageComponent, pageData, options);
	}

	async renderErrorPage(
		req: any,
		res: any,
		pageComponent: SsrPageComponent<any>,
		statusCode: number,
		title: string,
		description: string,
	) {
		return this.render(
			req,
			res,
			pageComponent,
			{
				title,
				description,
			},
			{
				statusCode,
				title,
				description,
			},
		);
	}

	async render(
		req: any,
		res: any,
		pageComponent: SsrPageComponent<any>,
		pageData: unknown,
		options: RenderOptions = {},
	) {
		if (!pageComponent) {
			throw new Error("RenderView page component is required");
		}

		const lang = getReqLang(req);
		const currentUser = await this.getCurrentUser(req);
		const translations = this.getTranslations(lang);
		const globalData = this.getGlobalData(lang);
		const bootstrap: SsrBootstrapPayload = {
			lang,
			translations,
			globalData,
			currentUser,
		};
		const props: PageComponentProps = {
			pageData,
			lang,
			t: (key: string, fallback?: string) => {
				const value = translations[key] || key;
				return value === key && fallback ? fallback : value;
			},
			globalData,
			requestContext: {
				req,
				res,
				currentUser,
			},
		};
		const assets = this.getPageAssets();
		const title = options.title || this.pickTitle(pageData);
		const description =
			options.description || this.pickDescription(pageData) || globalData.keywords;

		return new Promise<void>((resolve, reject) => {
			let didError = false;
			const { pipe, abort } = renderToPipeableStream(
				<HtmlDocument
					title={title}
					description={description}
					lang={lang}
					assets={assets}
					bootstrap={bootstrap}
				>
					<AppProvider
						bootstrap={bootstrap}
						requestContext={props.requestContext}
					>
						{pageComponent(props)}
					</AppProvider>
				</HtmlDocument>,
				{
					onShellReady: () => {
						res.status(options.statusCode ?? (didError ? 500 : 200));
						res.setHeader("Content-Type", "text/html; charset=utf-8");
						pipe(res);
						resolve();
					},
					onShellError: (error) => {
						reject(error);
					},
					onError: (error) => {
						didError = true;
						this.logger.error(
							"SSR render error",
							error instanceof Error ? error.stack : String(error),
							"RenderViewService",
						);
					},
				},
			);

			setTimeout(() => abort(), 10_000);
		});
	}

	getGlobalData(lang: ContentLang): GlobalData {
		if (isDefaultI18nLang(lang)) {
			return this.globalDataI18n[ContentLang.ZH_CN];
		}
		return this.globalDataI18n[lang];
	}

	getTranslations(lang: ContentLang) {
		if (isDefaultI18nLang(lang)) {
			return this.translationsI18n[ContentLang.ZH_CN] || {};
		}
		return this.translationsI18n[lang] || {};
	}

	async loadGlobal() {
		try {
			const codes = [
				"company_email",
				"company_tell",
				"company_address",
				"company_address_url",
				"custom_header_code",
				"custom_footer_code",
				"keywords",
				"i18n_enabled",
			];

			const [systemConfigZh, systemConfigEn] = await Promise.all([
				this.businessConfigService.findByCodes(codes),
				this.businessConfigService.findByCodes(codes, ContentLang.EN_US),
			]);

			const getValue = (
				list: BusinessConfig[],
				key: string,
				fallback = "",
			) => {
				return list.find((item) => item.code === key)?.content || fallback;
			};

			const zhGlobalData: GlobalData = {
				company_email: getValue(systemConfigZh, "company_email"),
				company_tell: getValue(systemConfigZh, "company_tell"),
				company_address: getValue(systemConfigZh, "company_address"),
				company_address_url: getValue(systemConfigZh, "company_address_url"),
				custom_header_code: getValue(systemConfigZh, "custom_header_code"),
				custom_footer_code: getValue(systemConfigZh, "custom_footer_code"),
				keywords: getValue(systemConfigZh, "keywords"),
				i18n_enabled: getValue(systemConfigZh, "i18n_enabled") === "1",
			};

			this.globalDataI18n = {
				[ContentLang.ZH_CN]: zhGlobalData,
				[ContentLang.EN_US]: {
					company_email: getValue(
						systemConfigEn,
						"company_email",
						zhGlobalData.company_email,
					),
					company_tell: getValue(
						systemConfigEn,
						"company_tell",
						zhGlobalData.company_tell,
					),
					company_address: getValue(
						systemConfigEn,
						"company_address",
						zhGlobalData.company_address,
					),
					company_address_url: getValue(
						systemConfigEn,
						"company_address_url",
						zhGlobalData.company_address_url,
					),
					custom_header_code: getValue(
						systemConfigEn,
						"custom_header_code",
						zhGlobalData.custom_header_code,
					),
					custom_footer_code: getValue(
						systemConfigEn,
						"custom_footer_code",
						zhGlobalData.custom_footer_code,
					),
					keywords: getValue(
						systemConfigEn,
						"keywords",
						zhGlobalData.keywords,
					),
					i18n_enabled: getValue(systemConfigEn, "i18n_enabled") === "1",
				},
			};
		} catch (error) {
			this.logger.error(
				"加载前台全局数据失败",
				error instanceof Error ? error.stack : String(error),
				"RenderViewService",
			);
		}
	}

	async loadI18n() {
		try {
			const list = await this.systemTranslationService.findAll();
			const zh: Record<string, string> = {};
			const en: Record<string, string> = {};

			for (const item of list) {
				if (item.lang === ContentLang.ZH_CN) {
					zh[item.key] = item.value;
				}
				if (item.lang === ContentLang.EN_US) {
					en[item.key] = item.value;
				}
			}

			this.translationsI18n = {
				[ContentLang.ZH_CN]: zh,
				[ContentLang.EN_US]: en,
			};
		} catch (error) {
			this.logger.error(
				"加载前台国际化失败",
				error instanceof Error ? error.stack : String(error),
				"RenderViewService",
			);
		}
	}

	private getPageAssets(): PageAssetManifest {
		if (this.cachedAssets) {
			return this.cachedAssets;
		}

		try {
			const manifest = require(SSR_MANIFEST_PATH);
			const files = Array.isArray(manifest.allFiles)
				? manifest.allFiles
				: [
						...(manifest.entries?.app?.initial?.js || []),
						...(manifest.entries?.app?.initial?.css || []),
					];
			this.cachedAssets = {
				js: files.filter((file: string) => file.endsWith(".js")),
				css: files.filter((file: string) => file.endsWith(".css")),
			};
		} catch (error) {
			this.cachedAssets = {
				js: [],
				css: [],
			};
			this.logger.warn(
				`加载 SSR manifest 失败: ${error instanceof Error ? error.message : String(error)}`,
				"RenderViewService",
			);
		}

		return this.cachedAssets;
	}

	private async getCurrentUser(req: any) {
		const token = req?.headers?.token || req?.cookies?.token;
		if (!token) {
			return null;
		}

		const [currentUser] = await this.authService.userClientIsLogin({ token });
		if (!currentUser) {
			return null;
		}

		return {
			id: currentUser.id,
			username: currentUser.username,
			cname: currentUser.cname,
			email: currentUser.email,
			phone: currentUser.phone,
		};
	}

	private pickTitle(pageData: unknown) {
		if (typeof pageData === "object" && pageData && "title" in pageData) {
			const title = (pageData as { title?: unknown }).title;
			if (typeof title === "string" && title.trim()) {
				return title;
			}
		}
		return "CMS SSR";
	}

	private pickDescription(pageData: unknown) {
		if (typeof pageData === "object" && pageData && "description" in pageData) {
			const description = (pageData as { description?: unknown }).description;
			if (typeof description === "string" && description.trim()) {
				return description;
			}
		}
		return "";
	}
}
