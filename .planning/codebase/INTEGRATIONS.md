# External Integrations

**Analysis Date:** 2026-03-26

## APIs & External Services

**Object Storage:**
- S3-compatible storage - used for avatar/file uploads in `server/src/modules/user_admin/user_admin.service.ts`.
  - SDK/Client: `@aws-sdk/client-s3`
  - Auth: `S3_SERVICE_BUCKET`, `S3_SERVICE_ADDRESS`, `S3_SERVICE_KEY`, `S3_SERVICE_SECRET` from `server/src/config/index.ts`

**Email Delivery:**
- SMTP mail server - used for email verification codes and password recovery in `server/src/modules/validate_code/validate_code.service.ts`.
  - SDK/Client: `nodemailer`
  - Auth: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_AUTH_USER`, `EMAIL_AUTH_PASS`, `EMAIL_FROM`

**SMS Delivery:**
- Alibaba Cloud SMS - used for phone verification codes in `server/src/utils/SMSClient.ts` and `server/src/modules/validate_code/validate_code.service.ts`.
  - SDK/Client: `@alicloud/dysmsapi20170525`, `@alicloud/openapi-client`
  - Auth: `SMS_SEND_ACCESS_KEY_ID`, `SMS_SEND_ACCESS_KEY_SECRET`, `SMS_SEND_EDNPINIT`, `SMS_SEND_TEMPLATE_CODE`, `SMS_SEND_SIGN_NAME`

**HTTP Outbound:**
- Arbitrary third-party webhook targets - configured per record and invoked from `server/src/modules/webhook_trans/webhook_trans.service.ts`.
  - SDK/Client: `axios`
  - Auth: not centralized; request destination and payload transform are stored in the `WebhookTrans` entity via `server/src/modules/webhook_trans/webhook_trans.entity.ts`

**Developer Tooling API:**
- Local Swagger JSON endpoint - used to generate shared API typings in `packages/api-interface/gen.js`.
  - SDK/Client: `swagger-typescript-api`
  - Auth: none detected

## Data Storage

**Databases:**
- SQLite via `better-sqlite3`
  - Connection: `DATABASE_PATH`
  - Client: `typeorm` with config in `server/src/app.module.ts`, `server/src/db/data-source.ts`, and `server/src/db/sqlite-options.ts`
- MySQL support is not active in the current runtime, even though `mysql2` is still installed in `server/package.json` and `readme.md` still mentions MySQL.

**File Storage:**
- Local filesystem - uploads and logs are written under `FILE_DATA_DIR_PATH` in `server/src/utils/index.ts`.
- S3-compatible bucket - optional external object storage path for uploaded files in `server/src/modules/user_admin/user_admin.service.ts`.

**Caching:**
- None detected. No Redis, Memcached, or application cache provider is configured in `server/src` or workspace manifests.

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based auth
  - Implementation: `jsonwebtoken` issues admin and client tokens in `server/src/modules/auth/auth.service.ts` and `server/src/modules/user_client/user_client.service.ts`
  - Secrets: `JWT_SECRET_KEY`, `JWT_CLIENT_SECRET_KEY` from `server/src/config/index.ts`
- Email and SMS verification are auxiliary identity channels for account recovery and code validation in `server/src/modules/validate_code/validate_code.service.ts`.

## Monitoring & Observability

**Error Tracking:**
- None detected. No Sentry, Datadog, Bugsnag, or similar external error SaaS appears in manifests or runtime code.

**Logs:**
- Local rotating log files via Winston in `server/src/modules/logger/logger.service.ts`
- Log directory is derived from `FILE_DATA_DIR_PATH` in `server/src/utils/index.ts`
- HTTP access, warn, error, and combined app logs are split into separate files.

## CI/CD & Deployment

**Hosting:**
- Dockerized Node deployment is defined in `Dockerfile`.
- The NestJS server serves API routes, admin static assets, uploaded files, and SSR assets from one process in `server/src/app.module.ts` and `server/src/main.ts`.

**CI Pipeline:**
- None detected. No GitHub Actions workflow or other CI config is present in the repository root.

## Environment Configuration

**Required env vars:**
- Core runtime: `PORT`, `NODE_ENV`, `FILE_DATA_DIR_PATH`
- Database: `DATABASE_PATH`, optionally `TYPEORM_SYNCHRONIZE`
- Auth: `PASSWORD_SALT`, `PASSWORD_CLIENT_SALT`, `JWT_SECRET_KEY`, `JWT_CLIENT_SECRET_KEY`
- Storage: `S3_SERVICE_BUCKET`, `S3_SERVICE_ADDRESS`, `S3_SERVICE_KEY`, `S3_SERVICE_SECRET`
- Email: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_AUTH_USER`, `EMAIL_AUTH_PASS`, `EMAIL_FROM`
- SMS: `SMS_SEND_ACCESS_KEY_ID`, `SMS_SEND_ACCESS_KEY_SECRET`, `SMS_SEND_EDNPINIT`, `SMS_SEND_TEMPLATE_CODE`, `SMS_SEND_SIGN_NAME`
- Logging: `LOG_LEVEL`

**Secrets location:**
- Server secrets are loaded from `server/env/.prod.env` and `server/env/.dev.env` according to `server/src/app.module.ts`.
- `server/.default.env` documents expected variable names and defaults.
- `clients/admin/.env` exists for admin-local configuration; contents were not read.

## Webhooks & Callbacks

**Incoming:**
- `POST /api/webhook_trans/send` in `server/src/modules/webhook_trans/webhook_trans.controller.ts`
- The admin UI exposes a copyable send URL in `clients/admin/src/routes/_main/webhook-trans/index.tsx`

**Outgoing:**
- Dynamic outbound HTTP requests are issued from `server/src/modules/webhook_trans/webhook_trans.service.ts` using stored `url`, `method`, and transform callbacks.
- The service executes `before_hook_func`, `data_trans_func`, and `callback_func` from database records before/after dispatch.

## Static Asset and UI Delivery Integrations

**Admin SPA Hosting:**
- Built admin assets are served from `server/admin-ui/dist` through `ServeStaticModule` in `server/src/app.module.ts`.
- Admin runtime base path is derived from `work.config.json`.

**SSR Package Hosting:**
- SSR assets are resolved from the workspace package `@cms/ssr` in `server/src/main.ts` and `server/src/modules/render_view/render_view.service.tsx`.
- Public assets are mounted under `/_fe_/` and `/_fe_/static` from `clients/ssr/rsbuild.config.mts` and `server/src/main.ts`.

## Rename Impact

- Package-scoped integrations use the `@cms/*` namespace and will need coordinated rename updates across `server/package.json`, `clients/admin/package.json`, `clients/ssr/package.json`, `packages/api-interface/package.json`, `server/tsconfig.json`, and application imports in `server/src/**/*.ts*` and `clients/admin/src/**/*.ts*`.
- Environment and deploy naming still includes `cms` in non-secret config keys or defaults: `work.config.json` (`cms_admin_path`), `server/src/utils/index.ts` (`cms_admin_path`, `cms_admin_iv_2025`), `server/.default.env` (`FILE_DATA_DIR_PATH` default path and commented values), and `server/src/modules/logger/logger.service.ts` (`cms-server` service metadata).
- Public URLs and browser-facing markers include `cms`: `readme.md` (`/_cms_admin/init_root_user`), `clients/ssr/src/runtime/client-component.tsx` (`data-cms-client-component`, `data-cms-client-props`, `__CMS_SSR_DATA__`), and `clients/ssr/rsbuild.config.mts` (`cms-ssr-use-client` plugin name).
- Generated docs and toolchain references hardcode `CMS` or `@cms/*` in `docs/ssr/react-ssr.md`, `docs/ssr/nestjs-ssr-integration.md`, `docs/ssr/react-ssr-architecture.md`, `.agents/skills/create-module/SKILL.md`, and `packages/cmd/createCURD/template/cms/**/*.tpl`.
- Branding/UI copy that surfaces integration context still says CMS in `clients/ssr/src/components/Header/index.tsx`, `server/src/modules/render_view/render_view.service.tsx`, and `readme.md`.

---

*Integration audit: 2026-03-26*
