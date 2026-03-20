# 项目真实结构与差异说明

## 总原则

- 以当前仓库代码为准，不以口头描述为准。
- 下面列出本次抽样确认过的真实路径和差异，后续创建模块时直接按这些路径操作。

## server 服务端

参考目录：
- `server/src/modules/news`

已确认文件：
- `news.entity.ts`
- `news.service.ts`
- `news.module.ts`
- `news.dto.ts`
- `news.controller.tsx`

说明：
- 用户草稿里没写 DTO，但真实模块通常需要 `{module}.dto.ts`
- 控制器示例文件后缀是 `.tsx`，不是 `.ts`
- `news.controller.tsx` 同时承载 SSR 页面渲染和 admin API

## admin 管理后台

真实根路径：
- `clients/admin/src/routes/_main`

不是：
- `client/admin/routes/_main`

参考模式 1，弹窗 CRUD：
- `clients/admin/src/routes/_main/banner`
- 文件：
  - `list.tsx`
  - `module/index.ts`
  - `module/services.ts`

参考模式 2，独立 create/update 页面：
- `clients/admin/src/routes/_main/news`
- 文件：
  - `list.tsx`
  - `create.tsx`
  - `update.$id.tsx`
  - `module/Form.tsx`
  - `module/index.ts`
  - `module/services.ts`

说明：
- 简单 CRUD 默认优先采用 `banner` 这种列表页模态框模式
- 复杂表单参考 `news`，把表单抽到 `module/Form.tsx`

## SSR 页面

真实页面根路径：
- `clients/ssr/src/pages`

参考目录：
- `clients/ssr/src/pages/news`

真实接入链路：
- `server/src/modules/news/news.controller.tsx`
- `server/src/modules/render_view/render_view.decorator.tsx`
- `server/src/modules/render_view/render_view.interceptor.ts`
- `server/src/modules/render_view/render_view.service.tsx`

说明：
- SSR 页面已经从旧的 `server/views/modules/*` 迁移到 `clients/ssr/src/pages/*`
- 页面组件需要从 `clients/ssr/src/pages/index.ts` 导出，再由服务端通过 `@cms/ssr/pages` 引用
- 服务端通过 `@RenderView(PageComponent)` + 返回普通 `pageData` 接入
- 不再使用 `server/views/index.tsx`
- 不再使用 `RenderViewResult`
- 不要从 `@cms/ssr/src/...` 导入，统一使用 `@cms/ssr/pages`、`@cms/ssr/server`、`@cms/ssr/helpers`

## 接口类型包

包位置：
- `packages/api-interface`

真实生成产物：
- `packages/api-interface/index.ts`

不是：
- `packages/api-interface/src/*`

生成脚本：
- `packages/api-interface/gen.js`

生成方式说明：
- 脚本会请求 `http://127.0.0.1:7001/api/admin-json`
- 说明生成依赖本地 server swagger 可访问

## 直接可复用的现有组件/工具

admin 常用：
- `PageTable`
- `AvailableSwitch`
- `RecommendFormItem`
- `UploadImage`
- `TableColumnSort`
- `createI18nColumn`
- `transformPagination`
- `transformSort`

server 常用：
- `successResponse`
- `createPermGroup`
- `AdminRoleGuard`
- `RenderView`
- `paginationTransform`
- `createOrder`
- `ContentTranslationService.overlayTranslations`
- `isDefaultI18nLang`

## 国际化基线

- 当前业务模块默认使用 `content_translation` 做内容国际化，而不是在业务表内为每种语言加一组字段。
- 默认语言是 `zh-CN`，判断逻辑在 `server/src/utils/index.ts` 的 `isDefaultI18nLang`。
- 请求语言通过 `@Lang()` 装饰器获取，来源见 `server/src/common/lang.decorator.ts`。
- 参考模块：
  - `server/src/modules/news/news.service.ts`
  - `server/src/modules/banner/banner.service.ts`
  - `clients/admin/src/routes/_main/news/list.tsx`
  - `clients/admin/src/utils/i18n.tsx`
- 约定：
  - server 里用于翻译查询的 `entity` 要稳定，推荐直接使用模块名
  - admin 翻译入口与 server 覆盖逻辑必须使用同一个 `entity`
  - 默认语言内容由业务表单编辑，翻译内容通过统一翻译抽屉或内容翻译页维护

## 创建模块时的最小决策

先回答这几个问题：
1. 这个模块是否需要对外 SSR 页面？
2. admin 是模态框 CRUD 还是独立表单页？
3. 如果需要 SSR，页面是新增到 `clients/ssr/src/pages`，还是只复用已有页面组件？
4. server 是否只需要 admin API，还是同时要提供 SSR 页面接口？
5. `@cms/api-interface` 的类型是否已经生成，若未生成是否要先启动 server 再执行生成？
