# Technology Stack

**Analysis Date:** 2026-03-26

## Languages

**Primary:**
- TypeScript 5.x - primary language for the NestJS server in `server/src`, the admin SPA in `clients/admin/src`, the SSR package in `clients/ssr/src`, and the shared contract package in `packages/api-interface/index.ts`.
- JavaScript (Node/CommonJS) - used for tooling and generators in `packages/cmd/createCURD`, `packages/api-interface/gen.js`, and root/package scripts in `package.json`.

**Secondary:**
- TSX/JSX - server-rendered React views and SSR runtime in `server/src/modules/**/*.tsx` and `clients/ssr/src/**/*.tsx`.
- SCSS/CSS - admin styling under `clients/admin/src/**/*.module.scss`.
- JSON - workspace/config metadata in `package.json`, `pnpm-workspace.yaml`, `work.config.json`, and `biome.json`.

## Runtime

**Environment:**
- Node.js 20 on Docker images, defined in `Dockerfile`.
- CommonJS output for server and SSR packages in `server/tsconfig.json` and `clients/ssr/package.json`.

**Package Manager:**
- `pnpm` workspace at the repo root in `pnpm-workspace.yaml`.
- Lockfile: present in `pnpm-lock.yaml`.

## Frameworks

**Core:**
- NestJS 10 - backend API, config, scheduling, static assets, and DI in `server/package.json` and `server/src/app.module.ts`.
- React 18 - admin SPA and SSR UI in `clients/admin/package.json`, `clients/ssr/package.json`, and root `package.json`.
- TanStack Router - file-based admin routing in `clients/admin/package.json`, `clients/admin/src/router/router.ts`, and generated `clients/admin/src/routeTree.gen.ts`.
- TypeORM 0.3 - ORM layer in `server/package.json`, `server/src/app.module.ts`, and `server/src/db/data-source.ts`.

**Testing:**
- Jest 29 with `ts-jest` - server unit and e2e test runner in `server/package.json`.
- Supertest - server HTTP test client in `server/package.json`.

**Build/Dev:**
- Rsbuild/Rspack - admin bundling in `clients/admin/rsbuild.config.ts` and SSR bundling in `clients/ssr/rsbuild.config.mts`.
- Nest CLI - server build/dev orchestration in `server/package.json` and `server/nest-cli.json`.
- Biome 2.3 - formatting and linting in `biome.json`.
- `swagger-typescript-api` - shared API type generation in `packages/api-interface/package.json` and `packages/api-interface/gen.js`.
- `concurrently` via `pnpm dlx` - root dev orchestration in `package.json`.

## Key Dependencies

**Critical:**
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` - application runtime in `server/package.json`.
- `@nestjs/config` - environment loading in `server/src/app.module.ts` and `server/src/config/index.ts`.
- `@nestjs/typeorm` and `typeorm` - persistence setup in `server/src/app.module.ts`, `server/src/db/sqlite-options.ts`, and `server/src/db/data-source.ts`.
- `better-sqlite3` - current active database driver in `server/package.json` and `server/src/db/sqlite-options.ts`.
- `jsonwebtoken` - admin/client JWT issuance and validation in `server/src/modules/auth/auth.service.ts` and `server/src/modules/user_client/user_client.service.ts`.
- `axios` - outgoing webhook delivery and admin HTTP client in `server/src/modules/webhook_trans/webhook_trans.service.ts` and `clients/admin/src/request/request.ts`.
- `react`, `react-dom` - shared UI runtime pinned at the root in `package.json`.

**Infrastructure:**
- `@aws-sdk/client-s3` - object storage uploads in `server/src/modules/user_admin/user_admin.service.ts`.
- `nodemailer` - SMTP mail delivery in `server/src/modules/validate_code/validate_code.service.ts`.
- `@alicloud/dysmsapi20170525` and `@alicloud/openapi-client` - Alibaba Cloud SMS in `server/src/utils/SMSClient.ts`.
- `winston` and `winston-daily-rotate-file` - structured rotating logs in `server/src/modules/logger/logger.service.ts`.
- `i18next` - SSR i18n runtime in `clients/ssr/src/runtime/i18n.tsx`.
- `@ant-design/pro-components`, `antd`, `ahooks`, `zustand`, `grapesjs`, `@wangeditor/*`, `codemirror` - admin UI framework and editors in `clients/admin/package.json`.
- `xlsx` from local tarball - spreadsheet import/export dependency in `server/package.json` via `local_packages/xlsx-0.20.3.tgz`.
- `mysql2` - installed but not wired into the active runtime; current boot path uses SQLite in `server/src/app.module.ts` and `server/src/db/data-source.ts`.

## Configuration

**Environment:**
- Server env files are loaded from `server/env/.prod.env` and `server/env/.dev.env` via `ConfigModule.forRoot` in `server/src/app.module.ts`.
- Default/example server variables are documented in `server/.default.env`.
- Admin has a local environment file present at `clients/admin/.env`; contents were not read.
- Key server config groups are centralized in `server/src/config/index.ts`: database path, password salts, JWT secrets, S3 credentials, SMTP settings, and SMS settings.
- The admin route mount name is stored in `work.config.json` and consumed by `server/src/app.module.ts`, `server/src/main.ts`, `clients/admin/rsbuild.config.ts`, `clients/admin/src/router/router.ts`, and `server/src/utils/index.ts`.

**Build:**
- Root scripts coordinate monorepo builds in `package.json`.
- Server compiles with Nest CLI from `server/package.json`.
- Admin outputs into `server/admin-ui/dist` via `clients/admin/rsbuild.config.ts`.
- SSR builds into `clients/ssr/dist/web` and `clients/ssr/dist/node` via `clients/ssr/rsbuild.config.mts`.
- Shared API types are generated from the live Swagger endpoint `http://127.0.0.1:7001/api/admin-json` in `packages/api-interface/gen.js`.

## Platform Requirements

**Development:**
- Node.js compatible with the workspace dependencies; Docker standardizes on Node 20 in `Dockerfile`.
- `pnpm` workspace support is required because internal packages use `workspace:*` references in `server/package.json`, `clients/admin/package.json`, and `clients/ssr/package.json`.
- A writable filesystem location for `FILE_DATA_DIR_PATH` is required because uploads and logs are written under that root in `server/src/utils/index.ts`.
- The server expects the SSR package to be resolvable as `@cms/ssr` from `server/src/main.ts` and `server/src/modules/render_view/render_view.service.tsx`.

**Production:**
- Docker multi-stage container build is defined in `Dockerfile`.
- Runtime serves one NestJS process that also hosts the built admin SPA and SSR assets from `server/src/app.module.ts` and `server/src/main.ts`.
- Secrets are expected from env files or container environment variables; no hosted secret manager integration is detected.

## Current Stack Notes

- The active persistence layer is SQLite, not MySQL. The runtime path uses `createSqliteNestOptions` in `server/src/app.module.ts` and `createSqliteDataSourceOptions` in `server/src/db/data-source.ts`.
- The repo still contains MySQL-oriented text in `readme.md` and retains `mysql2` as a dependency in `server/package.json`, so existing docs are partially stale relative to code.
- The root package still carries `uuid` and `@types/uuid` in `package.json`, but server code already uses `randomUUID` in `server/src/modules/user_admin/user_admin.service.ts`.

## Rename Impact

- Workspace and package names embed `cms`: root `package.json`, `server/package.json`, `clients/admin/package.json`, `clients/ssr/package.json`, and `packages/api-interface/package.json`.
- Internal import namespaces depend on `@cms/*`: `server/tsconfig.json`, `server/src/main.ts`, `server/src/modules/**/*.ts*`, `clients/admin/src/**/*.ts*`, `packages/cmd/createCURD/template/cms/**/*.tpl`, and docs under `docs/ssr/*.md`.
- Deploy/runtime identifiers embed `cms`: `work.config.json` (`cms_admin_path`), `server/src/utils/index.ts` (`cms_admin_path`, `cms_admin_iv_2025`), `server/.default.env` (`FILE_DATA_DIR_PATH="~/node_server_data/cms_server"`), and `server/src/modules/logger/logger.service.ts` (`service: 'cms-server'`).
- SSR/browser protocol markers embed `cms`: `clients/ssr/src/runtime/client-component.tsx` (`data-cms-client-*`, `__CMS_SSR_DATA__`), `clients/ssr/src/runtime/document.tsx`, `server/src/modules/render_view/render_view.service.tsx`, and `clients/ssr/rsbuild.config.mts` (`name: "cms-ssr-use-client"`).
- UI copy and branding still mention CMS in `readme.md`, `clients/ssr/src/components/Header/index.tsx`, `server/src/modules/render_view/render_view.service.tsx`, and `server/src/modules/home/home.controller.tsx`.
- Generated and derived artifacts will need regeneration after a rename: `clients/admin/src/routeTree.gen.ts`, `packages/api-interface/index.ts`, and any docs that reference `@cms/*` or `CMS` branding in `docs/ssr/*.md`.

---

*Stack analysis: 2026-03-26*
