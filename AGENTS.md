# 项目开发指南 (AGENTS.md)

本文档旨在帮助开发者和 AI Agent 快速理解本项目的结构、技术栈及开发流程。

## 1. 项目概览

基于 Monorepo 的 CMS 系统，包含服务端、管理后台、CLI 工具和共享类型库。

- **`server/`**: NestJS 服务端，提供 RESTful API
- **`clients/admin/`**: React + Rsbuild + TanStack Router + Ant Design 管理后台
- **`packages/api-interface/`**: 接口类型定义库
- **`packages/cmd/`**: CRUD 代码生成工具

## 2. 技术栈

- **服务端**: NestJS v10, TypeScript, TypeORM (MySQL), Swagger, Rspack, Winston, JWT, S3, Nodemailer
- **管理后台**: Rsbuild, React, TanStack Router, Ant Design v6, Zustand, WangEditor, CodeMirror, GrapesJS

## 3. 常用命令

### 开发
- `pnpm dev:server`: 启动服务端 (NestJS)
- `pnpm dev:admin`: 启动管理后台 (Rsbuild)
- `pnpm dev:fe`: 启动 Rspack 监听

### 构建
- `pnpm build`: 构建全部 (Admin + Server)
- `pnpm build:server`: 仅服务端
- `pnpm build:admin`: 仅管理后台

### CRUD 生成
- `pnpm crud`: 交互式创建新模块

### Lint 与格式化 (Biome)
- `pnpm biome check .`: 检查代码
- `pnpm biome check --write .`: 自动修复

### 测试命令 (在 server/ 目录执行)
- `pnpm test`: 运行所有测试
- `pnpm test:watch`: 监听模式
- `pnpm test:cov`: 覆盖率报告
- `pnpm test:e2e`: 端到端测试
- `pnpm test -- user.service.spec`: 运行单个测试文件
- `pnpm test -- --testNamePattern=<name>`: 运行单个测试用例

### 数据库迁移
- `migration:generate -- <name>`: 生成迁移
- `migration:run`: 运行迁移
- `migration:revert`: 回滚迁移

## 4. 开发工作流

1. **新增模块**: 使用 `pnpm crud` 命令
2. **接口类型**: 维护在 `packages/api-interface`
3. **服务端前端**: `server/views` 目录，React + Rspack

## 5. 代码规范

### 格式化与 Lint
- **工具**: Biome (`biome.json`)
- **缩进**: Tab (禁止空格)
- **引号**: 双引号 `"`
- **导入排序**: Biome 自动处理

### TypeScript
- **严格模式**: `strict: true`
- **路径别名**: `@/` 指向 `src/`
- **禁止 `any`**: 使用 `unknown` 或具体类型
- **类型 vs 接口**: `type` 用于联合/字面量，`interface` 用于对象

### 命名规范
- **文件**: kebab-case (`user.service.ts`)
- **类/接口**: PascalCase (`UserService`)
- **变量/函数**: camelCase (`userList`)
- **常量**: UPPER_SNAKE_CASE
- **布尔**: `is`, `has`, `can`, `should` 前缀

### 导入顺序
```typescript
// 1. Node 内置
import { randomUUID } from 'node:crypto';
// 2. 第三方
import { Injectable } from '@nestjs/common';
// 3. 项目内部 (使用路径别名)
import { UserService } from '@/modules/user/user.service';
// 4. 相对路径
import { ApiTags } from '@nestjs/swagger';
```

### 禁用规则
- **禁止 `uuid` 包**: 使用 `import { randomUUID } from 'node:crypto'`
- **禁止 `var`**: 使用 `const` 或 `let`
- **禁止 `any`**: 使用 `unknown`

### 错误处理
优先使用 NestJS 内置异常:
```typescript
throw new BadRequestException('Invalid input');
throw new NotFoundException('Not found');
throw new UnauthorizedException('Unauthorized');
throw new ForbiddenException('Access denied');
```
- 自定义异常: `src/modules/exception/`
- 异步异常: `catchError` / `throwError` (RxJS)

### Controller/Service 规范
- **Controller**: 请求接收、参数验证、调用 Service、返回响应
- **Service**: 业务逻辑
- **Entity**: 数据库表映射
- **DTO**: `class-validator` 验证

### 前端规范 (Admin)
- **路由目录**: `src/routes/`
- **状态管理**: Zustand (`src/store/`)
- **API 调用**: `useRequest` (ahooks) 或 React Query
- **表单**: ProForm + rules

## 6. 日志规范

使用 `LoggerService` (Winston + AsyncLocalStorage)，自动 Trace ID 追踪。

### 分级存储
- `error.log`: 错误日志
- `warn.log`: 警告日志
- `access.log`: HTTP 请求日志
- `combined.log`: 业务日志

### 使用方式
```typescript
// 注入
constructor(private readonly logger: LoggerService) {}

// 记录
this.logger.log('操作信息', 'ServiceName');
this.logger.warn('警告信息', 'ServiceName');
this.logger.error('错误信息', error.stack, 'ServiceName');
```

全局异常过滤器 `AllExceptionsFilter` 会自动捕获未处理异常。

---

依赖管理: pnpm workspaces。根目录 `package.json` 定义工作区。

## 7. Git 提交规范

- **语言**: 必须使用简体中文
- **格式**: 
```
<类型>(模块): <描述>  
- 其他描述（可选）
```
- **类型说明**:
  - `feat`: 新功能
  - `fix`: 修复 bug
  - `refactor`: 重构
  - `perf`: 性能优化
  - `test`: 测试相关
  - `docs`: 文档更新
  - `chore`: 构建/工具链更新

### 示例
```
feat: 新增用户管理模块
fix: 修复登录页验证码刷新问题
refactor: 优化用户查询逻辑
```
