# 项目开发指南 (AGENTS.md)

本文档旨在帮助开发者和 AI Agent 快速理解本项目的结构、技术栈及开发流程。

## 1. 项目概览

本项目是一个基于 Monorepo 结构的内容管理系统 (CMS)，包含服务端、管理后台前端、CLI 工具及共享类型库。

### 核心目录结构

- **`server/`**: 服务端项目，基于 NestJS。提供 RESTful API，并包含部分前端资源构建（SSR/静态资源）。
- **`clients/admin/`**: 管理后台前端，基于 React + Umi + Ant Design。
- **`packages/api-interface/`**: 接口类型定义库。根据服务端接口生成，用于前后端类型共享。
- **`packages/cmd/`**: 命令行工具集。包含用于快速生成 CRUD 接口代码和前端页面的脚本。
- **`local_packages/`**: 本地依赖包。

## 2. 技术栈

### 服务端 (Server)

- **核心框架**: [NestJS](https://nestjs.com/) (v10)
- **语言**: TypeScript
- **数据库 ORM**: TypeORM (MySQL)
- **API 文档**: Swagger (@nestjs/swagger)
- **构建工具**: Nest CLI, [Rspack](https://www.rspack.dev/) (用于 `views/` 下前端资源的构建)
- **关键依赖**:
  - `winston`: 日志管理
  - `jsonwebtoken`: 身份验证 (JWT)
  - `@aws-sdk/client-s3`: 文件存储 (S3 协议)
  - `nodemailer`: 邮件发送
  - `@alicloud/dysmsapi20170525`: 阿里云短信服务

### 管理后台 (Admin Client)

- **核心框架**: [Umi](https://umijs.org/) (v4)
- **UI 组件库**: [Ant Design](https://ant.design/) (v6), Ant Design Pro Components
- **状态管理**: Zustand
- **富文本/代码编辑器**:
  - WangEditor (富文本)
  - CodeMirror (代码编辑)
  - GrapesJS (低代码/页面构建)
- **图表库**: @ant-design/plots

### CLI 工具 (Cmd)

- **模板引擎**: Nunjucks (用于生成代码模板)
- **功能**: 提供 `crud` 命令，自动化生成 Controller, Service, Entity, DTO 以及对应的前端页面代码。

## 3. 常用命令 (Scripts)

在项目根目录下执行以下命令：

- **启动开发环境**:
  - `pnpm dev:server`: 启动服务端开发模式 (NestJS)。
  - `pnpm dev:admin`: 启动管理后台开发模式 (Umi)。
  - `pnpm dev:fe`: 启动服务端内置前端资源的构建监听 (Rspack)。

- **构建生产环境**:
  - `pnpm build`: 构建所有项目 (Admin + Server)。
  - `pnpm build:server`: 仅构建服务端。
  - `pnpm build:admin`: 仅构建管理后台。
  - `pnpm build:fe`: 构建服务端内置前端资源。

- **代码生成**:
  - `pnpm crud`: 运行 CRUD 生成器，交互式创建新模块。

## 4. 开发工作流指南

1.  **新增业务模块**:
    - 推荐使用 `pnpm crud` 命令。
    - 该命令会基于 `packages/cmd/createCURD/template` 下的模板，在 `server/src/modules` 生成后端代码，并在 `clients/admin/src/pages` 生成前端管理页面。

2.  **接口类型同步**:
    - `packages/api-interface` 目录用于维护接口类型。
    - 当后端 DTO 更新时，应注意同步更新此处的类型定义，以保证前端类型安全。

3.  **服务端前端资源**:
    - `server/views` 目录下的代码使用 React 编写，通过 Rspack 构建。
    - 这部分通常用于需要服务端渲染或与服务端紧密集成的页面（如登录页、错误页等）。

## 5. 依赖管理

本项目使用 `pnpm` workspaces 管理依赖。

- 根目录 `package.json` 定义了工作区。
- `clients/admin` 依赖于 workspace 中的 `@cms/api-interface` 和 `@cms/server`。

## 6. 代码规范

- **服务端禁用 `uuid` 包**: 统一使用 `import { randomUUID } from 'node:crypto';` 生成 UUID。
- 项目配置了 `Biome` 用于代码格式化和 Lint 检查。
- 提交代码前请确保通过 Lint 检查。

## 7. 日志规范

本项目使用增强版 `LoggerService`，集成了 `winston` 和 `AsyncLocalStorage`，实现了日志分级存储、结构化记录及全链路 Trace ID 追踪。

### 核心特性

- **自动追踪 (Trace ID)**: 所有请求会自动生成或继承 `traceId`，无需手动传递。
- **分级存储**:
  - `error.log`: 仅存储错误日志。
  - `warn.log`: 仅存储警告日志。
  - `access.log`: 专门存储 HTTP 请求访问日志（context='HTTP'）。
  - `combined.log`: 存储 Info 及以上级别的**业务逻辑日志**（不包含 HTTP 请求）。
- **优化策略**:
  - **日志分离**: 将高频的 HTTP 请求日志分离到 `access.log`，大幅减小 `combined.log` 体积。
  - **自动压缩**: 历史日志文件自动进行 Gzip 压缩 (`.gz`)，节省磁盘空间。
  - **大小限制**: `combined.log` 单个文件限制为 10MB，其他文件限制为 20MB。
- **结构化**: 日志以 JSON 格式存储，便于后续分析。

### 使用指南

1. **注入 Logger**:
   在 Service 或 Controller 中注入 `LoggerService`。

   ```typescript
   import { LoggerService } from '@/modules/logger/logger.service';

   @Injectable()
   export class MyService {
     constructor(private readonly logger: LoggerService) {}

     doSomething() {
       this.logger.log('Operation started', 'MyService');
     }
   }
   ```

2. **记录日志**:
   - **Info**: 记录常规业务流程信息。
     ```typescript
     this.logger.log({ action: 'create_user', userId: 123 }, 'UserService');
     ```
   - **Warn**: 记录非预期但不影响主流程的问题。
     ```typescript
     this.logger.warn('User missing profile', 'UserService');
     ```
   - **Error**: 记录导致当前操作失败的错误。**必须** 传递错误堆栈（如果存在）。
     ```typescript
     try {
       // ...
     } catch (error) {
       this.logger.error('Failed to create user', error.stack, 'UserService');
     }
     ```

3. **异常处理**:
   - 系统配置了全局异常过滤器 `AllExceptionsFilter`，会自动捕获所有未处理的异常并记录日志。
   - 开发者应优先抛出 NestJS 标准异常（如 `BadRequestException`），无需手动记录 Error 日志，过滤器会自动处理。
