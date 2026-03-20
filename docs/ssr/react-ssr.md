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

- [react-ssr-architecture.md](/Users/lyy/code/project/cms-server-work/docs/react-ssr-architecture.md)

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
- 登录 `LoginPage`
- 注册 `RegisterPage`
- 重置密码 `ResetPasswordPage`
- 结果页 `ResultPage`
- 404 `NotFoundPage`
- 500 `InternalServerErrorPage`

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
