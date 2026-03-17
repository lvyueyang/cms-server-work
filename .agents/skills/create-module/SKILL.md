---
name: create-module
description: Create a complete business module for this Saturn CMS monorepo. Use when adding or scaffolding a new domain across `server/src/modules`, `clients/admin/src/routes/_main`, `server/views/modules`, or when you need project-specific CRUD templates, SSR view guidance, and `@cms/api-interface` usage rules.
---

# 创建模块

## 概览

为这个仓库新增模块时，先以代码现状为准，再执行创建。不要机械照抄外部说明，因为本仓库的真实路径、文件后缀和生成方式与口头描述存在偏差。

优先读取：
- `references/project-map.md`
- `references/templates.md`

## 执行原则

- 先确认用户要新增的是哪一类模块：仅 server、server + admin，还是 server + admin + SSR。
- 先比对现有参考模块，再创建新文件。优先参考：
  - server: `server/src/modules/news`
  - admin 弹窗 CRUD: `clients/admin/src/routes/_main/banner`
  - admin 独立表单页: `clients/admin/src/routes/_main/news`
  - SSR: `server/views/modules/news`
- 发现描述与代码不一致时，以代码为准，并在结果中显式指出差异。
- 优先复用仓库现有命名、请求封装、表格组件、表单组件、权限装饰器和 SSR 渲染方式。

## 工作流

### 1. 确认模块模式

- 判断 admin 是否采用“列表页 + 模态框增删改查”。
  - 简单字段、无需复杂编辑器时，参考 `banner/list.tsx`
- 判断 admin 是否采用“列表页 + create/update 独立页面”。
  - 表单复杂、需要富文本/低代码编辑器时，参考 `news`
- 判断是否需要 SSR 页面。
  - 只有对外页面才创建 `server/views/modules/{module}`

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
- `controller` 同时考虑 admin API 与 SSR 页面渲染入口
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

### 4. 创建 SSR 模块

如需对外页面，在 `server/views/modules/{module}` 下创建：
- `view.tsx`
- `style.scss`
- `main.ts` 仅在当前构建链确实需要模块级入口时再创建

注意：
- 当前 `server/views/modules/news` 只有 `view.tsx` 和 `style.scss`，没有 `main.ts`
- 创建完 `view.tsx` 后，通常还要在 `server/views/index.tsx` 导出页面组件
- 对应模块的 controller 里用 `RenderViewResult` 渲染该组件，参考 `news.controller.tsx`

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
- SSR 页面组件是否已经在 controller 中被引用

## 输出要求

- 返回最终创建了哪些目录和文件
- 标注采用的是“弹窗 CRUD”还是“独立表单页”模式
- 如果仓库真实结构与用户要求不一致，单独列出差异
- 如有未完成项，明确指出还需要补哪些注册或联调步骤

## 参考资料

- 结构与差异说明：`references/project-map.md`
- 可复制模板片段：`references/templates.md`
