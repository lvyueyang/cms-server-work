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

真实根路径：
- `server/views/modules`

参考目录：
- `server/views/modules/news`

已确认文件：
- `view.tsx`
- `style.scss`

说明：
- 用户草稿要求 `main.ts`
- 当前 `news` 示例没有 `main.ts`
- 是否需要 `main.ts` 必须看当前 SSR/前端构建链的真实入口组织方式，不能硬加

## views 导出

页面组件通常还要从这里导出：
- `server/views/index.tsx`

`news` 已存在：
- `export * from './modules/news/view';`

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
- `transformPagination`
- `transformSort`

server 常用：
- `successResponse`
- `createPermGroup`
- `AdminRoleGuard`
- `RenderView`
- `RenderViewResult`
- `paginationTransform`
- `createOrder`

## 创建模块时的最小决策

先回答这几个问题：
1. 这个模块是否需要对外 SSR 页面？
2. admin 是模态框 CRUD 还是独立表单页？
3. server 是否只需要 admin API，还是同时要提供 SSR 页面接口？
4. `@cms/api-interface` 的类型是否已经生成，若未生成是否要先启动 server 再执行生成？
