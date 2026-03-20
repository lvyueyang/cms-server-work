import { Controller, Get, Req, Res } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import {
	HomePage,
	InternalServerErrorPage,
	NotFoundPage,
	SsrExamplesAssetsPage,
	SsrExamplesBoundariesPage,
	SsrExamplesBrowserApisPage,
	SsrExamplesClientIslandsPage,
	SsrExamplesI18nPage,
	SsrExamplesPage,
} from "@cms/ssr/pages";
import { Request, Response } from "express";
import Lang from "@/common/lang.decorator";
import { ContentLang } from "@/constants";
import { BannerService } from "../banner/banner.service";
import { NewsService } from "../news/news.service";
import { RenderView } from "../render_view/render_view.decorator";

function isEnglishLang(lang: ContentLang) {
	return lang === ContentLang.EN_US;
}

function createExampleRouteCards(isEnglish: boolean) {
	return [
		{
			label: isEnglish ? "Overview" : "总览",
			href: "/ssr-examples",
			description: isEnglish
				? "Entry page for the full SSR demo suite."
				: "整套 SSR 演示页面的总入口。",
		},
		{
			label: "I18n",
			href: "/ssr-examples/i18n",
			description: isEnglish
				? "Server + client translation context."
				: "服务端与客户端共享国际化上下文。",
		},
		{
			label: "Assets",
			href: "/ssr-examples/assets",
			description: isEnglish
				? "Static files, manifest, and bundle entry paths."
				: "静态文件、manifest 与构建资源路径。",
		},
		{
			label: isEnglish ? "Client Islands" : "客户端 Island",
			href: "/ssr-examples/client-islands",
			description: isEnglish
				? "Complex client components and lazy chunks."
				: "复杂客户端组件与懒加载 chunk。",
		},
		{
			label: isEnglish ? "Browser APIs" : "浏览器 API",
			href: "/ssr-examples/browser-apis",
			description: isEnglish
				? "Hydration-only browser capabilities."
				: "只在 hydration 之后可用的浏览器能力。",
		},
		{
			label: isEnglish ? "Boundaries" : "边界能力",
			href: "/ssr-examples/boundaries",
			description: isEnglish
				? "Supported and unsupported runtime boundaries."
				: "当前运行时的支持项与边界能力。",
		},
	];
}

function createCommonExampleData(isEnglish: boolean) {
	return {
		i18n_demo: {
			server_title_key: "ssr_examples.i18n.server_title",
			server_title_fallback: isEnglish
				? "Translated text can render on the server first"
				: "翻译文案可以先在服务端完成输出",
			server_body_key: "ssr_examples.i18n.server_body",
			server_body_fallback: isEnglish
				? "Use `t()` in page components and `useT()` inside shared components. Both read the same request-level i18n payload."
				: "页面组件里可以用 `t()`，共享组件里可以用 `useT()`，两者都读取同一份请求级国际化数据。",
			switch_links: [
				{
					label: isEnglish ? "Switch to Chinese" : "切换到中文",
					href: "/zh/ssr-examples/i18n",
				},
				{
					label: isEnglish ? "Switch to English" : "切换到英文",
					href: "/en/ssr-examples/i18n",
				},
			],
		},
		asset_demo: {
			asset_prefix: "/_fe_/",
			logo_alt: isEnglish ? "SSR static asset example" : "SSR 静态资源示例",
			resource_links: [
				{
					label: isEnglish ? "Public SVG asset" : "public SVG 资源",
					href: "/ssr-examples-cover.svg",
					description: isEnglish
						? "A static file served directly by Nest from the project public directory."
						: "由 Nest 直接从项目 public 目录对外提供的静态文件。",
				},
				{
					label: isEnglish ? "Manifest file" : "manifest 文件",
					href: "/_fe_/manifest.json",
					description: isEnglish
						? "RenderViewService reads this manifest and injects CSS and JS into the document shell."
						: "RenderViewService 会读取这个 manifest，并把 CSS 和 JS 注入到文档壳层中。",
				},
				{
					label: isEnglish ? "SSR examples route" : "SSR 示例页路由",
					href: "/ssr-examples",
					description: isEnglish
						? "The page itself consumes both the shared asset prefix and a static file served outside the bundle."
						: "页面本身同时使用了共享资源前缀和构建体系之外的静态文件引用。",
				},
				{
					label: isEnglish ? "Public uploads prefix" : "上传文件前缀",
					href: "/uploadfile",
					description: isEnglish
						? "Use this prefix for business upload files, separate from the Rsbuild SSR bundle assets."
						: "业务上传文件继续走这个前缀，与 Rsbuild 输出的 SSR 构建资源分开管理。",
				},
			],
		},
		client_demo: {
			items: [
				{
					id: 1,
					name: isEnglish ? "home hero bundle" : "首页首屏 bundle",
					category: "bundle" as const,
					size_label: "48 KB",
					status: "ready" as const,
				},
				{
					id: 2,
					name: isEnglish ? "news card image" : "新闻卡片图片",
					category: "image" as const,
					size_label: "280 KB",
					status: "ready" as const,
				},
				{
					id: 3,
					name: isEnglish ? "public article draft" : "公共文章草稿",
					category: "document" as const,
					size_label: "12 KB",
					status: "draft" as const,
				},
				{
					id: 4,
					name: isEnglish ? "lazy panel chunk" : "懒加载面板 chunk",
					category: "bundle" as const,
					size_label: "16 KB",
					status: "ready" as const,
				},
				{
					id: 5,
					name: isEnglish ? "header logo asset" : "头部 logo 资源",
					category: "image" as const,
					size_label: "96 KB",
					status: "archived" as const,
				},
			],
		},
		lazy_demo: {
			metric_cards: [
				{
					id: "stream",
					title: isEnglish ? "TTFB" : "首字节时间",
					value: isEnglish ? "180 ms" : "180 毫秒",
					trend: isEnglish ? "+12% faster" : "提升 12%",
				},
				{
					id: "mount",
					title: isEnglish ? "Client Mount" : "客户端挂载",
					value: isEnglish ? "1 island" : "1 个 island",
					trend: isEnglish ? "Lazy chunk follows" : "随后加载懒块",
				},
				{
					id: "i18n",
					title: isEnglish ? "I18n Payload" : "国际化载荷",
					value: isEnglish ? "shared" : "共享",
					trend: isEnglish ? "SSR + CSR reuse" : "SSR 与 CSR 复用",
				},
			],
		},
		form_demo: {
			initial_draft: {
				name: isEnglish ? "SSR Example Visitor" : "SSR 示例访客",
				email: "demo@cms-ssr.local",
				notes: isEnglish
					? "Hydration keeps this draft editable, then localStorage takes over on the client."
					: "hydration 之后这个草稿仍可继续编辑，随后由 localStorage 接管客户端持久化。",
			},
		},
		meta_demo: {
			title: isEnglish ? "SSR Examples" : "SSR 示例页",
			description: isEnglish
				? "Runnable examples for i18n, assets, complex client components, lazy-loaded chunks, and runtime boundaries."
				: "集中演示国际化、资源引用、复杂 client 组件、懒加载区块与运行时边界能力的可运行 SSR 示例。",
		},
	};
}

@Controller()
export class HomeController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly newsService: NewsService,
  ) {}

  @RenderView(HomePage)
  @Get('/')
  async index(@Lang() lang: ContentLang) {
    const [[banners], [news]] = await Promise.all([
      this.bannerService.findList(
        {
          position: ['home_top'],
          is_available: true,
          current: 1,
          page_size: 20,
          order_key: 'recommend',
          order_type: 'DESC',
        },
        lang,
      ),
      this.newsService.findList(
        {
          is_available: true,
          current: 1,
          page_size: 1,
          order_key: 'recommend',
          order_type: 'DESC',
        },
        lang,
      ),
    ]);
    return {
      title: '首页',
      banners,
      news,
    }
  }

	@RenderView(SsrExamplesPage)
	@Get("/ssr-examples")
	async ssrExamples(@Lang() lang: ContentLang) {
		const isEnglish = isEnglishLang(lang);
		const common = createCommonExampleData(isEnglish);

		return {
			title: isEnglish ? "SSR Example Suite" : "SSR 示例套件",
			description: isEnglish
				? "Overview page for the full SSR demo suite, covering supported capabilities and current runtime boundaries."
				: "整套 SSR 演示页面的总览页，集中展示当前已经支持的能力与运行时边界。",
			hero: {
				eyebrow: isEnglish ? "SSR Examples" : "SSR 示例",
				title: isEnglish
					? "A multi-page suite for validating current SSR behavior"
					: "用一组页面系统验证当前 SSR 的现有能力与边界能力",
				desc: isEnglish
					? "This route stays outside the main site navigation and is intended for team reference, debugging, and regression verification."
					: "这组路由不会进入主站主导航，主要作为团队参考、调试与回归验证入口。",
			},
			route_cards: createExampleRouteCards(isEnglish),
			capability_cards: [
				{
					title: isEnglish ? "Default SSR pages" : "默认 SSR 页面",
					description: isEnglish
						? "Plain page components render on the server first and receive request-level data through RenderViewService."
						: "普通页面组件默认先在服务端渲染，并通过 RenderViewService 接收请求级数据。",
					status: isEnglish ? "supported" : "已支持",
				},
				{
					title: isEnglish ? "Client islands" : "客户端 Island",
					description: isEnglish
						? "`'use client'` components mount after hydration and can use local state, transitions, and lazy chunks."
						: "`'use client'` 组件会在 hydration 后挂载，可使用本地状态、transition 与懒加载 chunk。",
					status: isEnglish ? "supported" : "已支持",
				},
				{
					title: isEnglish ? "Request + global context" : "请求与全局上下文",
					description: isEnglish
						? "Pages can read lang, request URL, globalData, and current user at render time."
						: "页面在渲染时可以读取 lang、请求 URL、globalData 与当前用户信息。",
					status: isEnglish ? "supported" : "已支持",
				},
				{
					title: isEnglish ? "Meta management" : "Meta 管理",
					description: isEnglish
						? "Only title and description are injected by default; richer SEO tags still require runtime extension."
						: "当前默认只注入 title 和 description；更丰富的 SEO 标签仍需继续扩展运行时。",
					status: isEnglish ? "boundary" : "边界能力",
				},
				{
					title: isEnglish ? "Unsupported features" : "未支持能力",
					description: isEnglish
						? "No RSC, no partial hydrate, and no server HTML output for client-only components."
						: "当前不支持 RSC、不支持局部 hydrate，也不会为 client-only 组件输出服务端 HTML。",
					status: isEnglish ? "boundary" : "边界能力",
				},
			],
			...common,
		};
	}

	@RenderView(SsrExamplesI18nPage)
	@Get("/ssr-examples/i18n")
	ssrExamplesI18n(@Lang() lang: ContentLang) {
		const isEnglish = isEnglishLang(lang);
		const common = createCommonExampleData(isEnglish);
		return {
			title: isEnglish ? "SSR I18n Examples" : "SSR 国际化示例",
			description: isEnglish
				? "Focused examples for server translations, client hooks, and language switching."
				: "聚焦演示服务端翻译、客户端 hooks 与语言切换链路。",
			server_copy: {
				title_key: common.i18n_demo.server_title_key,
				title_fallback: common.i18n_demo.server_title_fallback,
				body_key: common.i18n_demo.server_body_key,
				body_fallback: common.i18n_demo.server_body_fallback,
			},
			switch_links: common.i18n_demo.switch_links,
			debug: [
				{
					label: "lang cookie route",
					value: isEnglish ? "/en/*" : "/zh/*",
				},
				{
					label: "page route",
					value: "/ssr-examples/i18n",
				},
				{
					label: "fallback mode",
					value: isEnglish ? "en-US -> zh-CN" : "zh-CN primary",
				},
			],
		};
	}

	@RenderView(SsrExamplesAssetsPage)
	@Get("/ssr-examples/assets")
	ssrExamplesAssets(@Lang() lang: ContentLang) {
		const isEnglish = isEnglishLang(lang);
		const common = createCommonExampleData(isEnglish);
		return {
			title: isEnglish ? "SSR Asset Examples" : "SSR 资源示例",
			description: isEnglish
				? "Dedicated checks for public static files, manifest resources, and path boundaries."
				: "专门用于验证 public 静态文件、manifest 资源与路径分层边界。",
			cover: {
				src: "/ssr-examples-cover.svg",
				alt: common.asset_demo.logo_alt,
			},
			imported_images: [
				{
					title: isEnglish ? "Imported PNG logo" : "导入的 PNG logo",
					description: isEnglish
						? "Referenced with `import logoImage from \"../../assets/images/logo.png\"`."
						: "通过 `import logoImage from \"../../assets/images/logo.png\"` 引用。",
					kind: "import png",
				},
				{
					title: isEnglish ? "Imported JPG photos" : "导入的 JPG 图片",
					description: isEnglish
						? "Referenced from the downloaded demo photos under `clients/ssr/src/assets/images/examples/*`."
						: "引用自下载到 `clients/ssr/src/assets/images/examples/*` 下的演示图片。",
					kind: "import jpg",
				},
			],
			resource_links: common.asset_demo.resource_links,
			prefixes: [
				{
					title: "public",
					value: "/ssr-examples-cover.svg",
					description: isEnglish
						? "Served directly by Nest static assets."
						: "由 Nest 静态资源能力直接对外提供。",
				},
				{
					title: "bundle",
					value: "/_fe_/",
					description: isEnglish
						? "SSR frontend bundle output from Rsbuild."
						: "Rsbuild 输出的 SSR 前端构建资源前缀。",
				},
				{
					title: "imported modules",
					value: "clients/ssr/src/assets/images/*",
					description: isEnglish
						? "Imported images are bundled by the SSR frontend build and resolved to hashed asset URLs."
						: "通过 import 引入的图片会被 SSR 前端构建打包，并解析成带 hash 的资源 URL。",
				},
				{
					title: "uploads",
					value: "/uploadfile",
					description: isEnglish
						? "Business upload files live here, separate from bundle assets."
						: "业务上传文件走这个前缀，与构建资源分开。",
				},
			],
		};
	}

	@RenderView(SsrExamplesClientIslandsPage)
	@Get("/ssr-examples/client-islands")
	ssrExamplesClientIslands(@Lang() lang: ContentLang) {
		const isEnglish = isEnglishLang(lang);
		const common = createCommonExampleData(isEnglish);
		return {
			title: isEnglish ? "SSR Client Islands" : "SSR 客户端 Island 示例",
			description: isEnglish
				? "Complex `use client` examples with deferred filtering, transitions, and lazy chunks."
				: "聚焦复杂 `use client` 组件，包括 deferred filter、transition 与 lazy chunk。",
			client_demo: common.client_demo,
			lazy_demo: common.lazy_demo,
			notes: [
				{
					title: isEnglish ? "Serializable props only" : "仅传可序列化 props",
					description: isEnglish
						? "The server only passes plain JSON-like data into the client island."
						: "服务端只向客户端 island 传递普通 JSON 类数据。",
				},
				{
					title: isEnglish ? "Client mount after SSR" : "SSR 之后再客户端挂载",
					description: isEnglish
						? "The island is inserted as a placeholder in SSR HTML, then mounted in the browser."
						: "island 会先以占位节点出现在 SSR HTML 中，随后在浏览器端挂载。",
				},
				{
					title: isEnglish ? "Lazy chunk stays client-only" : "懒块保持客户端执行",
					description: isEnglish
						? "React.lazy runs after client mount and does not contribute server HTML."
						: "React.lazy 只会在客户端挂载后执行，不会贡献服务端 HTML。",
				},
			],
		};
	}

	@RenderView(SsrExamplesBrowserApisPage)
	@Get("/ssr-examples/browser-apis")
	ssrExamplesBrowserApis(@Lang() lang: ContentLang) {
		const isEnglish = isEnglishLang(lang);
		const common = createCommonExampleData(isEnglish);
		return {
			title: isEnglish ? "SSR Browser API Examples" : "SSR 浏览器 API 示例",
			description: isEnglish
				? "Hydration-only examples for form state, localStorage, clipboard, and navigator."
				: "聚焦 hydration 之后的表单状态、localStorage、clipboard 与 navigator 能力。",
			form_demo: common.form_demo,
			meta_demo: common.meta_demo,
			checklist: [
				{
					title: isEnglish ? "Initial draft from SSR" : "SSR 初始草稿",
					description: isEnglish
						? "The page still receives its first form state from the server."
						: "表单第一次渲染的初始状态仍然来自服务端。",
				},
				{
					title: isEnglish ? "localStorage takeover" : "localStorage 接管",
					description: isEnglish
						? "After hydration, browser storage can replace or extend the initial draft."
						: "hydration 之后可以由浏览器存储接管或覆盖初始草稿。",
				},
				{
					title: isEnglish ? "Browser-only APIs" : "浏览器专属 API",
					description: isEnglish
						? "navigator, location, and clipboard access must stay inside client components."
						: "navigator、location、clipboard 等访问必须放在 client 组件里。",
				},
			],
		};
	}

	@RenderView(SsrExamplesBoundariesPage)
	@Get("/ssr-examples/boundaries")
	ssrExamplesBoundaries(@Lang() lang: ContentLang) {
		const isEnglish = isEnglishLang(lang);
		const common = createCommonExampleData(isEnglish);
		return {
			title: isEnglish ? "SSR Runtime Boundaries" : "SSR 运行时边界能力",
			description: isEnglish
				? "A concentrated page for current support boundaries, unsupported features, and meta limitations."
				: "集中说明当前运行时支持边界、未支持能力与 meta 限制的说明页。",
			supported: [
				{
					title: isEnglish ? "Streamed HTML shell" : "流式 HTML 壳层",
					description: isEnglish
						? "RenderViewService streams the final HTML document and injects request-level bootstrap data."
						: "RenderViewService 会流式输出最终 HTML 文档，并注入请求级 bootstrap 数据。",
				},
				{
					title: isEnglish ? "Request-aware SSR" : "请求感知 SSR",
					description: isEnglish
						? "Page components can consume request URL, current user, language, and global config during SSR."
						: "页面组件在 SSR 期间可以读取请求 URL、当前用户、语言和全局配置。",
				},
				{
					title: isEnglish ? "Client error isolation" : "客户端错误隔离",
					description: isEnglish
						? "Client-only render errors can be contained by a local error boundary after hydration."
						: "hydration 之后，client-only 渲染错误可以由局部错误边界隔离。",
				},
			],
			boundaries: [
				{
					title: isEnglish ? "No React Server Components" : "不支持 React Server Components",
					description: isEnglish
						? "The runtime does not implement RSC semantics or the React Flight protocol."
						: "当前运行时没有实现 RSC 语义，也没有接入 React Flight 协议。",
					status: isEnglish ? "unsupported" : "未支持",
				},
				{
					title: isEnglish ? "No partial hydrate reuse" : "不支持局部 hydrate 复用",
					description: isEnglish
						? "Client islands mount fresh in the browser rather than hydrating server-rendered client HTML."
						: "客户端 island 会在浏览器端重新挂载，而不是复用服务端生成的 client HTML。",
					status: isEnglish ? "unsupported" : "未支持",
				},
				{
					title: isEnglish ? "Meta is still lightweight" : "Meta 仍然较轻量",
					description: isEnglish
						? "Only title and description are injected by default; richer SEO tags need runtime extension."
						: "当前默认只注入 title 和 description；更丰富的 SEO 标签仍需继续扩展运行时。",
					status: isEnglish ? "boundary" : "边界能力",
				},
			],
			meta: common.meta_demo,
		};
	}

  @Get(['/en', '/en/*'])
  @ApiExcludeEndpoint()
  enPage(@Req() req: Request, @Res() res: Response) {
    // 设置语言cookie为en
    res.cookie('lang', ContentLang.EN_US);

    // 获取原始路径，去掉开头的/en
    const originalUrl = req.url;
    const redirectPath = originalUrl.replace(/^\/en/, '') || '/';

    // 重定向到去掉/en的路径
    res.redirect(redirectPath);
    return;
  }

  @Get(['/zh', '/zh/*'])
  @ApiExcludeEndpoint()
  zhPage(@Req() req: Request, @Res() res: Response) {
    // 设置语言cookie为zh
    res.cookie('lang', ContentLang.ZH_CN);

    // 获取原始路径，去掉开头的/zh
    const originalUrl = req.url;
    const redirectPath = originalUrl.replace(/^\/zh/, '') || '/';

    // 重定向到去掉/zh的路径
    res.redirect(redirectPath);
    return;
  }

  @RenderView(NotFoundPage)
  @ApiExcludeEndpoint()
  @Get('/404')
  pageNotFound() {
    return {
      title: '404',
      description: '抱歉，您访问的页面不存在。',
    };
  }

  @RenderView(InternalServerErrorPage)
  @ApiExcludeEndpoint()
  @Get('/500')
  pageServerError() {
    return {
      title: '500',
      description: '页面渲染失败，请稍后重试。',
    };
  }
}
