# Architecture

**Analysis Date:** 2026-03-26

## Pattern Overview

**Overall:** Monorepo with a NestJS backend as the composition root, a separately built admin SPA, a separately built React SSR package, and a generated shared API contract package.

**Key Characteristics:**
- `server/` is the runtime hub. It owns process startup, HTTP middleware, database wiring, static asset hosting, admin UI hosting, and SSR page rendering from `@cms/ssr`.
- `clients/admin/` is a file-routed SPA built to `server/admin-ui/dist`, then served back by Nest under a configurable base path from `work.config.json`.
- `clients/ssr/` is a standalone package consumed by the backend through workspace package imports and TypeScript path aliases, not by direct HTTP proxying.
- `packages/api-interface/` is generated from Swagger and used as the type boundary for admin-to-server API calls.
- `packages/cmd/` is a code generator that encodes current architectural assumptions in templates under `packages/cmd/createCURD/template/`.

## Layers

**Workspace / Composition Layer:**
- Purpose: Define packages, scripts, and top-level naming.
- Location: `package.json`, `pnpm-workspace.yaml`, `work.config.json`
- Contains: workspace names, dev/build scripts, admin mount path, root package identity.
- Depends on: package manager resolution and workspace links.
- Used by: every package; especially `server/src/main.ts`, `server/src/app.module.ts`, `clients/admin/src/router/router.ts`, `clients/admin/rsbuild.config.ts`.

**Backend Bootstrap Layer:**
- Purpose: Start Nest, register middleware/pipes, mount static assets, and expose docs.
- Location: `server/src/main.ts`, `server/src/app.module.ts`
- Contains: `NestFactory` bootstrap, `ValidationPipe`, cookie/body parsing, static asset prefixes, TypeORM root config, global exception filters, admin UI static hosting.
- Depends on: `server/src/config/index.ts`, `server/src/utils/index.ts`, `server/src/modules/*`.
- Used by: all API, admin, file, and SSR requests.

**Backend Domain Module Layer:**
- Purpose: Encapsulate business features as Nest modules.
- Location: `server/src/modules/*`
- Contains: controller + service + dto + entity groupings such as `server/src/modules/news/*`, `server/src/modules/public_article/*`, `server/src/modules/file_manage/*`, `server/src/modules/user_admin/*`.
- Depends on: TypeORM, common helpers under `server/src/common/*`, shared interfaces under `server/src/interface`, utility helpers under `server/src/utils`.
- Used by: `server/src/app.module.ts` imports and cross-module injection.

**Backend Shared Infrastructure Layer:**
- Purpose: Provide reusable cross-cutting behavior.
- Location: `server/src/common/*`, `server/src/config/*`, `server/src/constants/*`, `server/src/db/*`, `server/src/interface/*`, `server/src/utils/*`
- Contains: filters, middleware, pipes, config registration, DB options/migrations, constants, shared response types, helper functions.
- Depends on: Nest core libraries and runtime env.
- Used by: nearly every backend module.

**SSR Integration Layer:**
- Purpose: Bridge Nest controllers to React SSR pages.
- Location: `server/src/modules/render_view/*`, `server/src/modules/home/home.controller.tsx`, `server/src/modules/news/news.controller.tsx`, `server/src/modules/public_article/public_article.controller.tsx`, `server/src/modules/result_page/result_page.controller.tsx`
- Contains: `RenderView` decorator, interceptor, server-side page rendering service, page component imports from `@cms/ssr/pages`, SSR global/i18n bootstrap logic.
- Depends on: `@cms/ssr/server`, `@cms/ssr/pages`, auth services, business/system config services.
- Used by: public-facing controllers that return HTML instead of JSON.

**Admin SPA Layer:**
- Purpose: Provide the authenticated management UI.
- Location: `clients/admin/src/*`
- Contains: file-based routes under `clients/admin/src/routes`, layout wrappers under `clients/admin/src/layouts`, API clients under `clients/admin/src/services` and route-local `module/services.ts`, Zustand stores under `clients/admin/src/store`, shared UI components under `clients/admin/src/components`.
- Depends on: `@tanstack/react-router`, `antd`, route generator plugin, `@cms/api-interface`, selected exports from `@cms/server/const`.
- Used by: browser clients under `/${cms_admin_path}`.

**SSR Package Layer:**
- Purpose: Provide reusable page components, runtime context, document shell, URL helpers, and client-island runtime.
- Location: `clients/ssr/src/*`
- Contains: public pages in `clients/ssr/src/pages`, runtime helpers in `clients/ssr/src/runtime`, layouts and interactive components.
- Depends on: React, React DOM, i18next, Rsbuild.
- Used by: backend SSR controllers and runtime asset mounting in `server/src/main.ts`.

**Contract / Generation Layer:**
- Purpose: Share API types and scaffold modules.
- Location: `packages/api-interface/index.ts`, `packages/cmd/createCURD/*`
- Contains: generated DTO/type definitions and CRUD templates for server/admin code generation.
- Depends on: Swagger generation and template conventions.
- Used by: admin routes/services, generator workflows, and future module scaffolding.

## Data Flow

**Admin CRUD Flow:**

1. Browser loads admin SPA at `/${workConfig.cms_admin_path}` using the router base path from `clients/admin/src/router/router.ts`.
2. Route files under `clients/admin/src/routes/*` render page components and call route-local or shared service functions such as `clients/admin/src/routes/_main/news/module/services.ts` or `clients/admin/src/services/user.ts`.
3. Request helpers prepend `AIP_FIX = "/api/admin"` from `clients/admin/src/constants/index.ts`.
4. Nest controllers under `server/src/modules/*/*.controller.ts` or `.tsx` receive JSON requests, validate DTOs, enforce auth/role guards, and call services.
5. Services use TypeORM repositories and return entities or IDs.
6. Controllers wrap results with `successResponse()` from `server/src/utils/index.ts`.
7. Swagger generation in `server/src/utils/useSwagger.ts` regenerates `packages/api-interface/index.ts`, which the admin imports as `@cms/api-interface`.

**Public SSR Flow:**

1. Public request hits a Nest route such as `/`, `/news`, `/news/:id`, `/article/:code`, or `/result-page` in `server/src/modules/home/home.controller.tsx`, `server/src/modules/news/news.controller.tsx`, `server/src/modules/public_article/public_article.controller.tsx`, or `server/src/modules/result_page/result_page.controller.tsx`.
2. Controller returns plain page data and decorates the handler with `@RenderView(PageComponent)`.
3. `server/src/modules/render_view/render_view.interceptor.ts` intercepts the response and forwards execution context, page component, and page data to `RenderViewService`.
4. `server/src/modules/render_view/render_view.service.tsx` reads auth state, translations, global config, and asset manifest, then renders the HTML shell using `@cms/ssr/server`.
5. Static SSR assets built by `clients/ssr` are served by Nest from `/_fe_/` and `/_fe_/static` as configured in `server/src/main.ts`.
6. Client components mount in the browser using the registry and bootstrap payload from `clients/ssr/src/runtime/client-component.tsx`.

**Authenticated File Download Flow:**

1. Client requests `/getfile/:id` or `/getfilebyname/:name` handled by `server/src/modules/file_manage/file_manage.controller.ts`.
2. If the file requires login, `AuthService` checks user token and redirects anonymous users to `createLoginPageUrl()` from `clients/ssr/src/runtime/url.ts`.
3. The controller streams the file and optionally records a tracking event via `TrackService`.

**State Management:**
- Backend state is request-driven plus database persistence through TypeORM and SQLite configuration from `server/src/app.module.ts`.
- Admin UI state is mostly route-local React state plus Zustand stores in `clients/admin/src/store/dict.ts`, `clients/admin/src/store/userinfo.ts`, and `clients/admin/src/store/global.ts`.
- SSR state is request-scoped and injected into `AppProvider` via `SsrBootstrapPayload` from `clients/ssr/src/runtime/types.ts`.

## Key Abstractions

**Nest Feature Module:**
- Purpose: Primary backend unit of encapsulation.
- Examples: `server/src/modules/news/news.module.ts`, `server/src/modules/file_manage/file_manage.module.ts`, `server/src/modules/user_admin/user_admin.module.ts`
- Pattern: Each module groups controller, service, DTOs, and entity in one directory.

**RenderView Bridge:**
- Purpose: Convert controller return data into HTML through SSR pages.
- Examples: `server/src/modules/render_view/render_view.decorator.tsx`, `server/src/modules/render_view/render_view.interceptor.ts`, `server/src/modules/render_view/render_view.service.tsx`
- Pattern: metadata + interceptor + service pipeline.

**Shared Contract Package:**
- Purpose: Typed API boundary between server and admin.
- Examples: `packages/api-interface/index.ts`, imports from `clients/admin/src/routes/_main/news/list.tsx`, `clients/admin/src/services/user.ts`
- Pattern: generated package consumed through workspace package name `@cms/api-interface`.

**File-Based Admin Route:**
- Purpose: Primary admin navigation unit.
- Examples: `clients/admin/src/routes/_main/news/list.tsx`, `clients/admin/src/routes/login/index.tsx`, `clients/admin/src/routes/init-root-user/index.tsx`
- Pattern: route file exports UI component plus `createFileRoute(...)`.

**Route-Local Module Helper Folder:**
- Purpose: Keep API adapters and small helpers next to a route without making them routable.
- Examples: `clients/admin/src/routes/_main/news/module/index.ts`, `clients/admin/src/routes/_main/news/module/services.ts`, `clients/admin/src/routes/login/modules/services.ts`
- Pattern: `module/`, `modules/`, and `*-module/` folders are ignored by the TanStack route generator via `clients/admin/rsbuild.config.ts`.

**SSR Runtime Package Surface:**
- Purpose: Stable import surface for server-side page rendering and helper reuse.
- Examples: `clients/ssr/package.json`, `clients/ssr/src/index.ts`, `clients/ssr/src/pages/index.ts`, `clients/ssr/src/runtime/url.ts`
- Pattern: import through package exports like `@cms/ssr/pages`, `@cms/ssr/server`, `@cms/ssr/helpers`.

## Entry Points

**Root Workspace:**
- Location: `package.json`
- Triggers: developer commands such as `pnpm dev`, `pnpm build`, `pnpm crud`
- Responsibilities: orchestrate server, admin, SSR, and generator commands.

**Backend Process:**
- Location: `server/src/main.ts`
- Triggers: `pnpm dev:server`, `pnpm build:server`, Nest runtime startup.
- Responsibilities: create Nest app, attach middleware/pipes, mount static assets, mount SSR bundle assets, expose Swagger, print URLs.

**Backend Module Graph Root:**
- Location: `server/src/app.module.ts`
- Triggers: imported by `server/src/main.ts`
- Responsibilities: load env config, initialize TypeORM, register global filters and middleware, mount admin static root, import all feature modules.

**Admin Browser App:**
- Location: `clients/admin/src/main.tsx`
- Triggers: browser load of admin HTML entry.
- Responsibilities: initialize React root, `ThemeProvider`, and `RouterProvider`.

**Admin Routing Root:**
- Location: `clients/admin/src/router/router.ts`, `clients/admin/src/routes/__root.tsx`, `clients/admin/src/routes/_main.tsx`
- Triggers: TanStack Router route resolution.
- Responsibilities: set router base path, auth gate the `_main` route tree, and provide top-level not-found behavior.

**SSR Package Node Entry:**
- Location: `clients/ssr/src/index.ts`
- Triggers: imports by `@cms/ssr`, `@cms/ssr/server`, `@cms/ssr/pages`, `@cms/ssr/helpers`.
- Responsibilities: re-export runtime/page APIs consumed by Nest and other packages.

**Code Generation Entry:**
- Location: `packages/cmd/createCURD/index.js`
- Triggers: `pnpm crud`
- Responsibilities: scaffold server/admin files using the existing CMS-oriented templates.

## Error Handling

**Strategy:** Nest handles API and page failures centrally, while SSR-specific failures are rendered as HTML through page components.

**Patterns:**
- Global backend errors flow through `server/src/common/filters/all-exceptions.filter.ts` and `server/src/common/filters/not-found.filter.tsx`.
- Role and login enforcement use guards such as `server/src/modules/auth/auth.guard.ts` and `server/src/modules/user_admin_role/user_admin_role.guard.ts`.
- Route-level admin redirects use TanStack Router `redirect()` in `clients/admin/src/routes/_main.tsx`.
- SSR stream errors are logged in `server/src/modules/render_view/render_view.service.tsx` and can fall back to error pages from `@cms/ssr/pages`.

## Cross-Cutting Concerns

**Logging:** `LoggerMiddleware` and `LoggerService` are wired globally in `server/src/app.module.ts` and `server/src/main.ts`.

**Validation:** `ValidationPipe` is global in `server/src/main.ts`; DTOs live beside modules in `server/src/modules/*/*.dto.ts`.

**Authentication:** Admin auth uses `/api/admin/*` token-protected endpoints and `_main` route gating; client auth helpers for SSR redirect logic live in `server/src/modules/auth/auth.guard.ts` and `clients/ssr/src/runtime/url.ts`.

## Rename Impact

- Workspace names are hard-coded at the package level in `package.json`, `server/package.json`, `clients/admin/package.json`, and `clients/ssr/package.json`. Renaming the project without aligning these leaves package imports on the old `@cms/*` namespace.
- Server-to-SSR coupling is name-sensitive in `server/tsconfig.json`, `server/src/main.ts`, `server/src/modules/render_view/render_view.service.tsx`, `server/src/modules/news/news.controller.tsx`, `server/src/modules/home/home.controller.tsx`, `server/src/modules/public_article/public_article.controller.tsx`, `server/src/modules/result_page/result_page.controller.tsx`, `server/src/common/filters/not-found.filter.tsx`, and `server/src/common/filters/all-exceptions.filter.ts`.
- Admin-to-shared-package imports are widespread. Primary rename touchpoints are `clients/admin/package.json`, `clients/admin/src/store/*.ts`, `clients/admin/src/services/*.ts`, `clients/admin/src/routes/**/*`, and components importing `@cms/server/const` such as `clients/admin/src/components/TranslationDrawer/TranslationDrawer.tsx`.
- Admin route mounting is name-sensitive through `work.config.json`, `clients/admin/rsbuild.config.ts`, `clients/admin/src/router/router.ts`, `server/src/app.module.ts`, `server/src/main.ts`, and documentation in `readme.md`.
- The SSR runtime still encodes `cms` in identifiers and DOM markers: `clients/ssr/rsbuild.config.mts` plugin name `"cms-ssr-use-client"`, `clients/ssr/src/runtime/client-component.tsx` attributes like `data-cms-client-component`, and payload element ID `__CMS_SSR_DATA__`.
- Utility and security-adjacent naming is also coupled: `server/src/utils/index.ts` parses `{ cms_admin_path: string }` and uses `cms_admin_iv_2025`; both should be reviewed deliberately during rename rather than blindly replaced.
- Code generation templates preserve the old naming and route conventions in `packages/cmd/createCURD/template/cms/*` and imports like `@cms/api-interface` / `@cms/server/const`. Renaming the live app without renaming templates will reintroduce stale names in future modules.
- Documentation and onboarding references still assume CMS naming in `readme.md`, `docs/ssr/react-ssr.md`, and `docs/ssr/nestjs-ssr-integration.md`. These are not runtime blockers but they will mislead future planning if left unchanged.

---

*Architecture analysis: 2026-03-26*
