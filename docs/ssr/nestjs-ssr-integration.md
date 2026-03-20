# NestJS 集成 React SSR 指南

本文档面向“其他 NestJS 项目复用当前这套 SSR 能力”的场景，目标是把本仓库已经跑通的 React SSR 接入链路迁移到新的 NestJS 服务端项目中。

本文基于当前仓库的真实实现：

- SSR 页面工程：`clients/ssr`
- Nest 接入层：`server/src/modules/render_view`
- 典型页面控制器：`server/src/modules/home/home.controller.tsx`

## 1. 最终接入效果

接入完成后，一个 NestJS 页面路由会具备以下能力：

1. 控制器通过 `@RenderView(PageComponent)` 声明它返回一个 SSR 页面
2. 控制器方法返回普通对象作为 `pageData`
3. `RenderViewInterceptor` 拦截返回值并交给 `RenderViewService`
4. `RenderViewService` 注入 `lang`、`translations`、`globalData`、`currentUser`
5. React 18 `renderToPipeableStream` 输出完整 HTML
6. 浏览器端加载 `/_fe_/` 下的 JS/CSS
7. 带 `'use client'` 的组件在浏览器端首次挂载

## 2. 你需要迁移哪些东西

最少需要迁移 4 层：

### 2.1 SSR 页面工程

直接复用或参考：

- `clients/ssr`

至少保留这些能力：

- `src/pages`
- `src/runtime/context.tsx`
- `src/runtime/i18n.tsx`
- `src/runtime/document.tsx`
- `src/runtime/client-component.tsx`
- `src/client.tsx`
- `rsbuild.config.mts`

### 2.2 Nest 接入层

直接复用或参考：

- `server/src/modules/render_view/render_view.decorator.tsx`
- `server/src/modules/render_view/render_view.interceptor.ts`
- `server/src/modules/render_view/render_view.service.tsx`
- `server/src/modules/render_view/render_view.module.ts`

### 2.3 静态资源挂载

在你的 Nest 启动入口中挂载：

- SSR web 构建产物：`/_fe_/`
- SSR node 静态资源：`/_fe_/static`
- 你自己的业务静态目录：如 `/uploadfile`、`/public/*`

当前仓库对应代码见：

- [main.ts](/Users/lyy/code/project/cms-server-work/server/src/main.ts#L44)

### 2.4 页面路由接入

控制器中从 `@cms/ssr/pages` 引入页面组件，并这样使用：

```tsx
import { Get } from "@nestjs/common";
import { ExamplePage } from "@cms/ssr/pages";
import { RenderView } from "../render_view/render_view.decorator";

export class ExampleController {
	@Get("/example")
	@RenderView(ExamplePage)
	page() {
		return {
			title: "示例页",
			description: "这是一个 SSR 页面",
		};
	}
}
```

## 3. SSR 包如何组织

推荐保持和当前仓库一致：

### 3.1 package.json 导出

`clients/ssr/package.json` 里至少保留这些导出：

- `@cms/ssr`
- `@cms/ssr/pages`
- `@cms/ssr/server`
- `@cms/ssr/helpers`

当前实现见：

- [package.json](/Users/lyy/code/project/cms-server-work/clients/ssr/package.json)

### 3.2 构建产物

构建后应得到：

- `dist/web/manifest.json`
- `dist/web/static/js/*`
- `dist/web/static/css/*`
- `dist/node/index.js`
- `dist/node/static/*`
- `dist/types/*`

关键点：

- `web` 构建负责浏览器入口和 `manifest.json`
- `node` 构建负责服务端可执行页面包
- `node` 侧也要设置 `assetPrefix: "/_fe_/"`，否则导入图片资源可能生成错误 URL

当前实现见：

- [rsbuild.config.mts](/Users/lyy/code/project/cms-server-work/clients/ssr/rsbuild.config.mts#L159)

## 4. Nest 侧最小接入步骤

### 4.1 安装依赖

目标项目至少需要：

- `react`
- `react-dom`
- `i18next`
- `@nestjs/platform-express`

如果 SSR 页面工程作为 workspace 包单独存在，还需要让 Nest 项目能依赖它。

### 4.2 注册 RenderViewModule

把 `RenderViewModule` 引入你的 Nest `AppModule`：

```ts
import { Module } from "@nestjs/common";
import { RenderViewModule } from "./modules/render_view/render_view.module";

@Module({
	imports: [RenderViewModule],
})
export class AppModule {}
```

如果你保留当前写法，`RenderViewModule` 可以继续是 `@Global()` 模块。

### 4.3 挂载 SSR 静态资源

在 `main.ts` 中：

```ts
import { dirname, join } from "node:path";

const ssrPackageDir = dirname(require.resolve("@cms/ssr/package.json"));

app.useStaticAssets(join(ssrPackageDir, "dist/web"), {
	prefix: "/_fe_/",
});

app.useStaticAssets(join(ssrPackageDir, "dist/node/static"), {
	prefix: "/_fe_/static",
});
```

这是当前实现里最容易漏掉的一步。

如果你页面里通过 `import heroImage from "./hero.jpg"` 引入图片，但没有挂载 `dist/node/static`，页面上就会出现 404。

### 4.4 控制器里接入 SSR 页面

控制器方法直接返回 `pageData`：

```tsx
@Get("/news")
@RenderView(NewsListPage)
async list() {
	return {
		title: "新闻列表",
		dataList: [],
	};
}
```

不要再使用旧的 `RenderViewResult`。

## 5. RenderViewService 里哪些逻辑必须改成你自己的

当前项目里的 `RenderViewService` 不是“完全通用”的，你迁到其他 NestJS 项目时，至少要确认下面 4 个点。

### 5.1 语言来源

当前代码依赖：

- `getReqLang(req)`
- `ContentLang`
- `isDefaultI18nLang`

如果你的新项目没有这一套，需要自己替换成：

- cookie
- header
- URL segment
- query

中的一种语言识别方案。

### 5.2 全局配置来源

当前代码通过：

- `BusinessConfigService`
- `business_config`

构造 `globalData`。

如果新项目没有这套表结构，可以先降级成固定对象：

```ts
const globalData = {
	company_email: "",
	company_tell: "",
	company_address: "",
	company_address_url: "",
	custom_header_code: "",
	custom_footer_code: "",
	i18n_enabled: false,
	keywords: "",
};
```

### 5.3 翻译来源

当前代码通过：

- `SystemTranslationService`
- `system_translation`

加载翻译资源。

如果新项目没有这张表，可以先改成：

- 本地 JSON
- 配置中心
- 空对象

只要最终能构造：

```ts
Record<string, string>
```

即可。

### 5.4 当前用户来源

当前代码通过 `AuthService` + token 获取当前登录用户。

如果新项目认证体系不同，需要重写：

- `getCurrentUser(req)`

这个方法。

如果你暂时不需要当前用户上下文，可以直接返回 `null`。

## 6. 页面组件应该怎么写

页面组件统一使用：

```ts
PageComponentProps<TPageData>
```

可拿到：

- `pageData`
- `lang`
- `t`
- `globalData`
- `requestContext`

最小例子：

```tsx
import type { PageComponentProps } from "@cms/ssr/server";

interface ExamplePageData {
	title: string;
}

export function ExamplePage({
	pageData,
	t,
}: PageComponentProps<ExamplePageData>) {
	return (
		<div>
			<h1>{pageData.title}</h1>
			<p>{t("example.desc", "默认描述")}</p>
		</div>
	);
}
```

## 7. `'use client'` 组件的接入规则

### 7.1 必须写在独立文件首行

```tsx
'use client';
```

### 7.2 只能接收可序列化 props

不要传：

- 函数
- `Date`
- class 实例
- `Map`
- `Set`

### 7.3 浏览器 API 只能在 client 组件里访问

例如：

- `window`
- `document`
- `navigator`
- `localStorage`
- `location`
- `clipboard`

### 7.4 必须在浏览器入口注册

当前项目通过在 `clients/ssr/src/client.tsx` 中直接引入模块，让构建期注册逻辑生效：

```ts
import "./components/SsrExamplesDashboard";
import "./components/SsrExamplesLab";
```

如果你新增了 `'use client'` 组件，但浏览器入口没引入，它不会挂载。

## 8. 导入图片资源时的额外注意事项

如果页面中直接写：

```tsx
import teamImage from "../../assets/images/team.jpg";
```

你需要同时满足 3 件事：

1. `clients/ssr` 的构建工具能处理图片资源
2. `node` 构建产物生成的图片 URL 带上 `/_fe_/` 前缀
3. Nest 侧挂载 `dist/node/static` 到 `/_fe_/static`

另外，由于当前 `@cms/server` 在编译时直接消费 `clients/ssr/src/*` 源码，server 侧还要补图片模块声明，例如：

```ts
declare module "*.jpg" {
	const src: string;
	export default src;
}
```

当前实现见：

- [server/src/types/assets.d.ts](/Users/lyy/code/project/cms-server-work/server/src/types/assets.d.ts)

## 9. 其他 NestJS 项目推荐的最小迁移顺序

建议按这个顺序接：

1. 先把 `clients/ssr` 单独跑通，确认可以 build
2. 在 Nest 中挂载 `/_fe_/` 和 `/_fe_/static`
3. 接入 `RenderViewModule`
4. 先做一个最简单的 `@RenderView(HomePage)` 路由
5. 再接 `lang`、`translations`、`globalData`
6. 最后再接 `currentUser`、错误页、client islands、图片导入资源

这样最容易定位问题。

## 10. 迁移时最常见的问题

### 10.1 页面能渲染，但 JS/CSS 没加载

优先检查：

- `dist/web/manifest.json` 是否存在
- `RenderViewService` 是否读取到了 manifest
- `/_fe_/` 是否正确挂载

### 10.2 导入图片后页面 404

优先检查：

- `node` 构建是否输出到了 `dist/node/static`
- `node` 构建的 `assetPrefix` 是否是 `/_fe_/`
- Nest 是否挂载了 `dist/node/static -> /_fe_/static`

### 10.3 `'use client'` 组件不挂载

优先检查：

- 文件首行是否有 `'use client'`
- 浏览器入口是否引入了该模块
- props 是否可序列化

### 10.4 server build 报找不到 `*.png/*.jpg`

优先检查：

- server 侧是否有图片模块声明
- Nest 项目是不是直接消费了 SSR 源码

### 10.5 英文页面始终不切换

优先检查：

- `getReqLang()` 的来源
- `/en/*` 和 `/zh/*` 的 cookie 改写逻辑
- `translations` 是否真的按语言加载

## 11. 当前这套方案的边界

当前已经支持：

- React 18 流式 SSR
- 请求级 `pageData`
- 轻量 i18n 上下文
- `'use client'` 客户端挂载
- `React.lazy` + `Suspense`
- 导入图片资源

当前还不支持：

- React Server Components
- 部分 hydrate 复用
- client-only 组件的服务端 HTML 输出
- 完整 SEO meta 管理框架

## 12. 推荐参考文件

- 核心接入：
  - [render_view.decorator.tsx](/Users/lyy/code/project/cms-server-work/server/src/modules/render_view/render_view.decorator.tsx)
  - [render_view.interceptor.ts](/Users/lyy/code/project/cms-server-work/server/src/modules/render_view/render_view.interceptor.ts)
  - [render_view.service.tsx](/Users/lyy/code/project/cms-server-work/server/src/modules/render_view/render_view.service.tsx)
- 启动挂载：
  - [main.ts](/Users/lyy/code/project/cms-server-work/server/src/main.ts)
- 页面与示例：
  - [home.controller.tsx](/Users/lyy/code/project/cms-server-work/server/src/modules/home/home.controller.tsx)
  - [clients/ssr/src/pages/ssr-examples](/Users/lyy/code/project/cms-server-work/clients/ssr/src/pages/ssr-examples)
- 设计说明：
  - [react-ssr.md](/Users/lyy/code/project/cms-server-work/docs/ssr/react-ssr.md)
  - [react-ssr-architecture.md](/Users/lyy/code/project/cms-server-work/docs/ssr/react-ssr-architecture.md)
