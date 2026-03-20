# React SSR 实施记录

## 背景

本次改造目标是在当前 CMS Monorepo 中落地一套基于 React 的 SSR 方案，并统一前台页面的服务端渲染入口。

本次需求来自一次完整的需求讨论与实施过程，最终实现已落到：

- `clients/ssr`
- `server/src/modules/render_view`
- 若干前台控制器、错误过滤器与登录跳转 helper

## 原始需求

### 用户提出的核心要求

1. 支持 React 流式渲染。
2. 组件默认服务端渲染，带 `'use client'` 标记的组件走客户端渲染。
3. 支持基于 `i18next` 的国际化。

### 最初使用方式示例

说明：

- 原始提案里页面导入写法是 `@cms/ssr/src/pages/news`。
- 实施后统一调整为包导出写法 `@cms/ssr/pages`。

以新闻列表页为例，控制器通过 `@RenderView(PageComponent)` 声明该路由返回 SSR 页面：

```ts
import { NewsListPage } from "@cms/ssr/pages";
import { RenderView } from "../render_view/render_view.decorator";

export class NewsController {
  @Get("/news")
  @RenderView(NewsListPage)
  async list(
    @Query() { current = 1 }: { current: number },
    @Lang() lang: ContentLang,
  ) {
    const limit = 20;
    const [list, total] = await this.services.findList(
      {
        current,
        page_size: limit,
        order_key: "recommend",
        order_type: "DESC",
      },
      lang,
    );

    const max = total / limit;
    const next = current < max ? current + 1 : 0;
    const prev = current > 1 ? current - 1 : 0;

    return {
      title: "新闻列表",
      dataList: list,
      prev,
      next,
    };
  }
}
```

### 原始数据流约定

讨论中明确的页面渲染数据流如下：

1. 请求 `/news`
2. `NewsController.list()` 返回页面数据
3. `NewsListPage` 在 `pageData` 中接收数据并渲染
4. 服务端返回最终 HTML

如果页面中引用了带 `'use client'` 标记的组件，例如 `Count`，则该组件不参与服务端真实渲染，只在浏览器端首次挂载。

## 本次讨论后确定的关键决策

### 渲染语义

- 页面默认 SSR。
- `'use client'` 首版采用“纯客户端挂载”语义。
- 不做 React Server Components。
- 不做客户端组件的服务端 HTML 预渲染。
- 不做局部 hydrate 复用。

### 页面接入方式

- 使用显式 `@RenderView(PageComponent)`。
- 不做基于路由的自动页面发现。

### 包导入方式

- 不再使用 `@cms/ssr/src/...`。
- 统一从 `@cms/ssr/pages`、`@cms/ssr/helpers`、`@cms/ssr/server` 等包导出入口引用。

### 国际化

- 保持基于 `i18next`。
- 不新增 `react-i18next`。
- 通过项目内轻量 `AppProvider / useT / useLang` 封装提供 React 使用方式。

### 错误页

- `RenderViewResult` 废弃。
- 新增固定 SSR 页面 `/404` 与 `/500`。
- 404 与 SSR 渲染异常统一走内部改写，不做 HTTP 跳转。

### 构建工具与样式

- SSR 构建工具统一采用 `Rsbuild`。
- SSR 页面样式主方案采用 `Tailwind CSS`。

## 最终实现摘要

### 1. 新增 `clients/ssr` 正式 SSR 页面包

已完成：

- 使用 `Rsbuild` 做 `web + node` 双环境构建。
- `dist/web` 输出浏览器资源与 `manifest.json`。
- `dist/node` 输出服务端可执行入口。
- `dist/types` 输出类型声明。
- 新增根导出文件 `src/index.ts`。

关键文件：

- `clients/ssr/rsbuild.config.mts`
- `clients/ssr/postcss.config.mjs`
- `clients/ssr/tsconfig.types.json`

### 2. 新增 SSR 运行时

已完成：

- `runtime/document.tsx`
  - 负责输出完整 HTML 文档结构。
- `runtime/context.tsx`
  - 负责 SSR/CSR 共用上下文注入。
- `runtime/i18n.tsx`
  - 基于 `i18next` 提供 `useT` / `useLang`。
- `runtime/client-component.tsx`
  - 负责 `'use client'` 组件的占位、注册与浏览器端挂载。
- `runtime/url.ts`
  - 迁移 `createLoginPageUrl` / `createResultPageUrl`。

### 3. `RenderView` 链路重写

已完成：

- `RenderView` 装饰器现在通过 metadata 记录页面组件。
- `RenderViewInterceptor` 从 metadata 读取页面组件。
- `RenderViewService` 改为真正的流式 SSR 渲染器。
- 使用 `renderToPipeableStream` 做 HTML 流式输出。
- 读取 `clients/ssr/dist/web/manifest.json` 注入 JS/CSS。
- 请求级注入：
  - `pageData`
  - `lang`
  - `t`
  - `globalData`
  - `requestContext`
  - 当前登录用户信息

架构说明见：

- [react-ssr-architecture.md](/Users/lyy/code/project/cms-server-work/docs/ssr/react-ssr-architecture.md)

### 4. 错误页与结果页

已完成：

- `/404`
- `/500`
- `/result-page`

对应页面已迁移到 `@cms/ssr/pages`。

### 5. 已迁移的服务端引用

已完成迁移的主要位置：

- `home.controller.tsx`
- `news.controller.tsx`
- `public_article.controller.tsx`
- `user_client.controller.tsx`
- `auth.guard.ts`
- `file_manage.controller.ts`
- `not-found.filter.tsx`
- `all-exceptions.filter.ts`

## 当前页面能力

当前 `clients/ssr` 已包含以下页面或基础页面：

- 首页 `HomePage`
- 新闻列表 `NewsListPage`
- 新闻详情 `NewsDetailPage`
- 公共文章详情 `PublicArticleDetailPage`
- 示例页 `SsrExamplesPage`
- 登录 `LoginPage`
- 注册 `RegisterPage`
- 重置密码 `ResetPasswordPage`
- 结果页 `ResultPage`
- 404 `NotFoundPage`
- 500 `InternalServerErrorPage`

## 可运行示例页套件

当前仓库提供了一组专门的 SSR 示例页：

- 总览：`/ssr-examples`
- 国际化：`/ssr-examples/i18n`
- 资源引用：`/ssr-examples/assets`
- client islands：`/ssr-examples/client-islands`
- 浏览器 API：`/ssr-examples/browser-apis`
- 边界能力：`/ssr-examples/boundaries`

这些页面都不会进入主导航，主要用于团队参考、联调和回归验证。

覆盖范围：

- 服务端 `t()` 与组件内 `useT()` / `useLang()` 的国际化用法
- `public/*` 静态文件、`/_fe_/manifest.json` 与 `/uploadfile` 的路径分工
- 复杂 `'use client'` 组件的本地状态、异步刷新、错误态、`useDeferredValue`、`startTransition`
- `React.lazy` + `Suspense` 懒加载子区块
- hydration 后的表单状态、`localStorage` / `navigator` / `clipboard` 等浏览器 API
- 客户端错误边界与当前 meta 能力边界
- 不支持项说明：RSC、局部 hydrate、client 组件服务端 HTML 复用

如需新增同类示例，优先继续沿用这组页面的结构，而不是把演示逻辑散落到业务页。

## `'use client'` 使用方式

### 规则

- 文件首行声明 `'use client'`。
- 该组件在服务端不会真实执行渲染逻辑。
- 服务端只输出占位节点和序列化 props。
- 浏览器端启动后通过 runtime 自动挂载。

### 示例

```tsx
'use client';

import { useState } from "react";

export function Count() {
  const [value, setValue] = useState(0);

  return (
    <button type="button" onClick={() => setValue((v) => v + 1)}>
      {value}
    </button>
  );
}
```

## 国际化方案

### 服务端

- 语言来源仍复用服务端现有 `Lang()` / `getReqLang()`。
- `RenderViewService` 继续维护：
  - `loadGlobal()`
  - `loadI18n()`
- 数据来源：
  - `business_config`
  - `system_translation`

### 客户端

- 服务端将当前语言翻译资源直接注入 `__CMS_SSR_DATA__`。
- 浏览器端挂载后复用同一份资源创建 `i18next` 实例。

最小示例：

```tsx
import { useLang, useT } from "@cms/ssr";

export function ExampleBlock() {
  const t = useT();
  const lang = useLang();

  return (
    <div>
      <h2>{t("ssr_examples.title", lang === "en-US" ? "SSR Examples" : "SSR 示例")}</h2>
      <p>{lang}</p>
    </div>
  );
}
```

服务端页面组件也可以直接读取 `t`：

```tsx
export function ExamplePage({ t }: PageComponentProps<any>) {
  return <h1>{t("ssr_examples.title", "SSR 示例")}</h1>;
}
```

## 文件资源引用

SSR 页面可以直接引用由服务端暴露的静态文件：

```tsx
export function ExampleAsset() {
  return <img src="/ssr-examples-cover.svg" alt="cover" />;
}
```

资源链路约定：

- `clients/ssr/dist/web/manifest.json` 由 `RenderViewService` 读取并注入 CSS/JS
- 浏览器构建资源统一挂载在 `/_fe_/`
- `clients/ssr/src/assets/images/*` 中通过 `import` 引入的图片会参与前端构建并解析成资源 URL
- 项目 `public/*` 目录下的静态文件直接由 Nest 暴露
- 业务上传文件继续走 `/uploadfile`

当前实现细节：

- 进入 `web` 构建的 JS/CSS 仍由 `manifest.json` 注入并通过 `/_fe_/` 提供
- 进入 `node` bundle 的导入图片会被编译成 `/_fe_/static/image/*` 形式的 URL
- `server/src/main.ts` 会额外挂载 `dist/node/static` 到 `/_fe_/static`

导入图片的最小示例：

```tsx
import logoImage from "../../assets/images/logo.png";
import teamImage from "../../assets/images/examples/team.jpg";

export function ExampleAssetImports() {
  return (
    <>
      <img src={logoImage} alt="logo" />
      <img src={teamImage} alt="team" />
    </>
  );
}
```

说明：

- 这类写法由 `clients/ssr` 构建链负责打包
- 为了让 `@cms/server` 在直接消费 `@cms/ssr` 源码时也能通过类型检查，仓库里额外补了图片模块声明
- `/ssr-examples/assets` 页面现在同时覆盖 `import` 图片资源和 `public/*` 静态资源两类示例

## 复杂 `'use client'` 组件

当前推荐把复杂交互逻辑放进单独的 `'use client'` 文件，并只通过可序列化 props 接收初始数据：

```tsx
'use client';

import { useEffect, useState } from "react";

export function ClientPanel({ initialItems }: { initialItems: Array<{ id: number; name: string }> }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) return <div>loading...</div>;
  return <div>{items.length}</div>;
}
```

注意：

- 不要给 `'use client'` 组件传函数
- 不要传 `Date`、类实例、Map/Set 等非稳定 JSON 结构
- 浏览器端要确保该模块已经在 `clients/ssr/src/client.tsx` 中被引入，以便注册到 runtime
- `/ssr-examples` 中的 dashboard 还演示了 `useDeferredValue` 和 `startTransition` 的用法

## 懒加载组件

懒加载应放在 `'use client'` 组件内部：

```tsx
'use client';

import { lazy, Suspense } from "react";

const LazyPanel = lazy(() => import("./LazyPanel"));

export function ClientShell() {
  return (
    <Suspense fallback={<div>loading chunk...</div>}>
      <LazyPanel />
    </Suspense>
  );
}
```

约束：

- `React.lazy` 的实际加载发生在浏览器挂载后
- 当前架构不支持把懒加载 client 组件内容预渲染成服务端 HTML
- `/ssr-examples` 中的仪表盘区块已经提供完整可运行示例

## 表单与浏览器 API

涉及浏览器能力的示例必须放在 `'use client'` 组件里：

```tsx
'use client';

import { useEffect, useState } from "react";

export function BrowserOnlyExample() {
  const [lang, setLang] = useState("");

  useEffect(() => {
    setLang(window.navigator.language);
  }, []);

  return <div>{lang}</div>;
}
```

推荐模式：

- SSR 页面只负责把初始可序列化数据传给 client 组件
- `localStorage`、`navigator`、`location`、`clipboard` 等能力统一在 `useEffect` 或事件回调中访问
- `/ssr-examples/browser-apis` 的 lab 区块已经覆盖表单持久化、复制 URL 和浏览器信息读取

## 错误边界与 Meta

当前示例页套件额外演示了两个边界：

- 客户端错误边界：
  - 用于隔离 hydration 后局部 client 组件的渲染异常
  - 不影响外围 SSR 页面结构
- Meta 能力边界：
  - 当前运行时默认只注入 `title` 和 `description`
  - `canonical`、Open Graph、Twitter Card 等 richer meta 仍需扩展 `HtmlDocument` / `RenderViewService`

## 当前开发命令

根目录脚本：

```json
{
  "dev": "pnpm dlx concurrently -n ssr,server,admin -c blue,green,magenta \"pnpm dev:ssr\" \"pnpm dev:server\" \"pnpm dev:admin\"",
  "dev:ssr": "npm run dev --prefix ./clients/ssr",
  "dev:server": "npm run dev --prefix ./server",
  "dev:admin": "npm run dev --prefix ./clients/admin",
  "build:ssr": "npm run build --prefix ./clients/ssr"
}
```

### 推荐开发方式

直接在根目录执行：

```bash
pnpm dev
```

会同时启动：

- SSR 构建监听
- Nest 服务端
- 管理后台

## 已完成验证

本次改造完成后，已通过以下校验：

```bash
pnpm --filter @cms/ssr check
pnpm --filter @cms/ssr build
pnpm --filter @cms/server build
```

## 注意事项

1. `RenderViewResult` 已废弃，不应再新增使用。
2. 新增 SSR 页面时，优先放到 `clients/ssr/src/pages`。
3. 服务端应从 `@cms/ssr/pages` 引用页面组件。
4. `'use client'` 组件的 props 必须可序列化。
5. 目前错误页采用内部改写，不改变原请求 URL。

## 后续可继续完善的方向

- 细化页面级 meta 管理能力。
- 为更多前台页面补齐 SSR 页面组件。
- 为 `'use client'` 组件补更严格的构建期检查。
- 增加 E2E 验证，覆盖：
  - `/news`
  - `/news/:id`
  - `/article/:code`
  - `/404`
  - `/500`
  - `/login`
  - `/register`
  - `/reset-password`
