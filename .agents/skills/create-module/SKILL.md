---
name: create-module
description: Create a complete business module for this Saturn CMS monorepo. Use when adding or scaffolding a new domain across `server/src/modules`, `clients/admin/src/routes/_main`, `clients/ssr/src/pages`, or when you need project-specific CRUD templates, SSR page guidance, and `@cms/api-interface` usage rules.
---

# 创建模块

## 概览

为这个仓库新增模块时，先以代码现状为准，再执行创建。不要机械照抄外部说明，因为本仓库的真实路径、文件后缀和生成方式与口头描述存在偏差。

本项目的业务模块默认需要支持内容国际化。除非用户明确说明该模块不需要国际化，否则创建模块时应默认接入 `content_translation` 体系，并同时补齐 server 读取覆盖和 admin 翻译维护入口。

优先读取：
- `references/project-map.md`
- `references/templates.md`

## 执行原则

- 先确认用户要新增的是哪一类模块：仅 server、server + admin，还是 server + admin + SSR。
- 先比对现有参考模块，再创建新文件。优先参考：
  - server: `server/src/modules/news`
  - admin 弹窗 CRUD: `clients/admin/src/routes/_main/banner`
  - admin 独立表单页: `clients/admin/src/routes/_main/news`
  - SSR 页面: `clients/ssr/src/pages/news`
  - SSR 接入链路: `server/src/modules/news/news.controller.tsx`、`server/src/modules/render_view`
- 涉及内容国际化时，优先参考：
  - server 翻译覆盖：`server/src/modules/news/news.service.ts`
  - 常量化写法：`server/src/modules/banner/banner.service.ts`
  - admin 翻译入口：`clients/admin/src/routes/_main/news/list.tsx`
  - 通用列渲染：`clients/admin/src/utils/i18n.tsx`
  - 翻译抽屉：`clients/admin/src/components/TranslationDrawer`
- 发现描述与代码不一致时，以代码为准，并在结果中显式指出差异。
- 优先复用仓库现有命名、请求封装、表格组件、表单组件、权限装饰器和 SSR 渲染方式。

## 工作流

### 1. 确认模块模式

- 判断 admin 是否采用“列表页 + 模态框增删改查”。
  - 简单字段、无需复杂编辑器时，参考 `banner/list.tsx`
- 判断 admin 是否采用“列表页 + create/update 独立页面”。
  - 表单复杂、需要富文本/低代码编辑器时，参考 `news`
  - 如果是“标题/封面/详情”这类常规内容详情页，默认优先使用富文本编辑器 `Editor`
  - 只有用户明确要求低代码搭建、区块拖拽或仓库现有模块已证明必须用 `LowCodeEditor` 时，才默认选低代码编辑器
- 判断是否需要 SSR 页面。
  - 只有对外页面才创建 `clients/ssr/src/pages/{module}`

### 2. 创建 server 模块

在 `server/src/modules/{module}` 下至少创建：
- `{module}.entity.ts`
- `{module}.controller.ts` 或与现有模块保持一致的 `.controller.tsx`
- `{module}.service.ts`
- `{module}.module.ts`

通常还需要补：
- `{module}.dto.ts`

执行要求：
- `entity` 继承项目现有基础实体模式，字段装饰器参考 `news.entity.ts`
- `service` 负责 CRUD 与查询封装，尽量沿用 `createOrder`、`paginationTransform` 等现有工具
- 默认加入国际化常量与覆盖逻辑：
  - 定义 `static I18N_KEY = '{module}'`
  - 定义 `static I18N_FIELDS = [...]`，仅包含实际需要翻译的字符串字段
  - 注入 `ContentTranslationService`
  - 在对外读取方法中接收 `lang?: ContentLang`
  - 在 `findList`、`findById`、`findNextAndPrev`、`findAll` 等读取方法里，对非默认语言调用 `overlayTranslations`
- 默认语言仍存主表，其他语言内容不要落到业务表冗余字段中
- `controller` 同时考虑 admin API 与 SSR 页面渲染入口
  - 需要 SSR 时，从 `@cms/ssr/pages` 导入页面组件，并通过 `@RenderView(PageComponent)` 挂到公开路由
  - SSR 控制器方法直接返回普通对象作为 `pageData`，不要再使用 `RenderViewResult`
- `module` 中注册 `TypeOrmModule.forFeature([...])`

### 3. 创建 admin 模块

真实路径是 `clients/admin/src/routes/_main/{module}`，不是 `client/admin/routes/_main`。

基础文件：
- `list.tsx`
- `module/index.ts`
- `module/services.ts`

按模式补充：
- 模态框 CRUD 模式：把创建/编辑逻辑直接放在 `list.tsx`
- 独立表单页模式：增加 `create.tsx`、`update.$id.tsx`、`module/Form.tsx`

admin 约束：
- 接口类型直接从 `@cms/api-interface` 引用
- 列表请求优先复用 `PageTable`、`transformPagination`、`transformSort`
- 常见字段优先复用现有组件，如 `UploadImage`、`RecommendFormItem`、`AvailableSwitch`
- “详情”内容字段默认优先使用富文本编辑器 `@/components/Editor`；仅在明确需要低代码能力时才使用 `@/components/LowcodeEditor`
- 默认给可翻译列接入国际化入口：
  - `const i18nColumn = createI18nColumn<TableItem>('{module}')`
  - 对标题、描述、正文、图片 URL、链接 URL 等可翻译字段，优先使用 `i18nColumn(...)`
  - 根据字段类型传 `transType`，如 `ContentType.LowCode`、`ContentType.Rich`、`ContentType.IMAGE`
- 如果是独立表单页模式，表单本身仍编辑默认语言内容；翻译入口优先挂在列表页列渲染中，不要把多语言字段直接塞进基础表单，除非用户明确要求

### 4. 创建 SSR 页面

如需对外页面，在 `clients/ssr/src/pages/{module}` 下创建页面组件，最小接入通常包括：
- `index.tsx`
- 如页面较复杂，再按需补充分拆组件或局部样式；不要再创建 `server/views/modules/{module}`

SSR 页面要求：
- 页面组件统一放在 `clients/ssr`，由 `Rsbuild` 输出 SSR bundle 和浏览器静态资源
- 页面组件创建后，补充 `clients/ssr/src/pages/index.ts` 导出，供服务端通过 `@cms/ssr/pages` 引用
- 页面组件签名参考 `PageComponentProps<TPageData>`，从 `pageData`、`lang`、`t`、`globalData`、`requestContext` 取值
- 页面默认 SSR；只有明确需要浏览器交互时，才把局部组件拆成 `'use client'` 组件
- `'use client'` 组件只做浏览器首次挂载，不参与服务端真实 HTML 渲染；传入 props 时优先保持可序列化
- SSR 页面内部优先复用 `clients/ssr/src/layouts/main.tsx`、`clients/ssr/src/runtime/*` 现有能力，不要自行拼 HTML 文档结构

服务端接入要求：
- 在公开 controller 中从 `@cms/ssr/pages` 导入页面组件，例如 `import { ModuleNamePage } from "@cms/ssr/pages";`
- 页面路由使用 `@RenderView(ModuleNamePage)`，返回普通对象作为 `pageData`
- 页面标题、描述等优先放在返回的 `pageData` 中，让 `RenderViewService` 统一注入 `<title>` / description
- 不要再创建 `server/views/index.tsx`
- 不要再使用 `RenderViewResult`
- 不要再使用 `@cms/ssr/src/...` 这类源码路径导入，统一使用包导出入口：`@cms/ssr/pages`、`@cms/ssr/server`、`@cms/ssr/helpers`

### 5. 处理接口类型

- `packages/api-interface` 是自动生成包
- 当前生成产物在 `packages/api-interface/index.ts`，不是 `src/` 目录
- 生成脚本位于 `packages/api-interface/gen.js`
- 生成依赖服务端 swagger：`http://127.0.0.1:7001/api/admin-json`

需要更新类型时：
- 先确保 server 已启动
- 再运行项目已有生成方式，例如在该包目录执行 `pnpm gen`

### 6. 验证

- server 文件是否齐全并被现有模块系统正确引用
- admin 路径是否在 `clients/admin/src/routes/_main` 下
- `services.ts` 的路径前缀是否与 server controller 一致
- `@cms/api-interface` 中所需类型是否已可用
- SSR 页面是否已建在 `clients/ssr/src/pages/{module}`，并从 `clients/ssr/src/pages/index.ts` 导出
- controller 是否已从 `@cms/ssr/pages` 引用页面组件，并通过 `@RenderView(PageComponent)` 接入
- 是否避免继续创建 `server/views/modules/*`、`server/views/index.tsx`、`RenderViewResult`
- 若使用 `'use client'` 组件，props 是否保持可序列化，且只承载交互逻辑
- 模块是否声明了稳定的国际化实体 key，且 admin 与 server 使用相同的 `entity`
- server 的对外读取逻辑是否已对非默认语言调用 `overlayTranslations`
- admin 列表页是否已给可翻译列挂上 `createI18nColumn`
- 是否避免手动修改 `packages/api-interface/index.ts` 与 `clients/admin/src/routeTree.gen.ts`

## 输出要求

- 返回最终创建了哪些目录和文件
- 标注采用的是“弹窗 CRUD”还是“独立表单页”模式
- 如果包含 SSR，标注新增了哪些 `clients/ssr` 页面文件，以及 controller 上接入了哪些 `@RenderView(PageComponent)` 路由
- 标注该模块启用了哪些国际化字段，以及 server/admin 分别在哪些位置接入
- 如果仓库真实结构与用户要求不一致，单独列出差异
- 如有未完成项，明确指出还需要补哪些注册或联调步骤

## 参考资料

- 结构与差异说明：`references/project-map.md`
- 可复制模板片段：`references/templates.md`
- SSR 设计说明：`docs/ssr/react-ssr.md`
- SSR 架构说明：`docs/ssr/react-ssr-architecture.md`
