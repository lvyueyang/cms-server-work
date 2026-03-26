# Codebase Structure

**Analysis Date:** 2026-03-26

## Directory Layout

```text
cms-server-work/
├── server/                  # NestJS backend, static hosting, SSR integration, DB access
├── clients/admin/           # Admin SPA built with Rsbuild + TanStack Router + Ant Design
├── clients/ssr/             # Reusable React SSR package consumed by the backend
├── packages/api-interface/  # Generated shared API contract package
├── packages/cmd/            # CRUD generator and templates
├── docs/                    # Architecture and SSR implementation notes
├── public/                  # Public static assets served by Nest
├── work.config.json         # Deploy-time admin mount path configuration
├── package.json             # Root workspace scripts and package identity
└── pnpm-workspace.yaml      # Workspace membership
```

## Directory Purposes

**`server/`:**
- Purpose: Main runtime application.
- Contains: Nest bootstrap, modules, DB config, shared utils, filters, constants, migrations, tests.
- Key files: `server/src/main.ts`, `server/src/app.module.ts`, `server/src/config/index.ts`, `server/src/utils/index.ts`, `server/src/db/data-source.ts`

**`server/src/modules/`:**
- Purpose: Feature-oriented backend code.
- Contains: one folder per business or infrastructure module.
- Key files: `server/src/modules/auth/auth.module.ts`, `server/src/modules/render_view/render_view.module.ts`, `server/src/modules/news/news.module.ts`, `server/src/modules/file_manage/file_manage.module.ts`

**`server/src/common/`:**
- Purpose: Backend cross-cutting support code.
- Contains: filters, middleware, pipes, shared metadata helpers, common domain constants.
- Key files: `server/src/common/filters/all-exceptions.filter.ts`, `server/src/common/filters/not-found.filter.tsx`, `server/src/common/middleware/logger.middleware.ts`, `server/src/common/pipes/parse-int.pipe.ts`

**`clients/admin/`:**
- Purpose: Management UI project.
- Contains: browser entry, file routes, layouts, shared components, stores, request layer, route-local modules.
- Key files: `clients/admin/src/main.tsx`, `clients/admin/src/router/router.ts`, `clients/admin/rsbuild.config.ts`, `clients/admin/src/routes/__root.tsx`, `clients/admin/src/routes/_main.tsx`

**`clients/admin/src/routes/`:**
- Purpose: Actual TanStack file-routed pages.
- Contains: route files, route-local API modules, nested route folders, auth/init flows.
- Key files: `clients/admin/src/routes/login/index.tsx`, `clients/admin/src/routes/init-root-user/index.tsx`, `clients/admin/src/routes/_main/news/list.tsx`, `clients/admin/src/routes/_main/public-article/list.tsx`

**`clients/admin/src/pages/`:**
- Purpose: Legacy or transitional page tree.
- Contains: very little active code compared with `src/routes/`.
- Key files: `clients/admin/src/pages/login/module`, `clients/admin/src/pages/init-root-user/module`

**`clients/ssr/`:**
- Purpose: SSR package built once and imported by the backend as a workspace dependency.
- Contains: page components, runtime context/i18n/document helpers, client-island support, styles, layouts, assets.
- Key files: `clients/ssr/src/index.ts`, `clients/ssr/rsbuild.config.mts`, `clients/ssr/src/pages/index.ts`, `clients/ssr/src/runtime/client-component.tsx`, `clients/ssr/src/runtime/url.ts`

**`packages/api-interface/`:**
- Purpose: Shared generated contract package.
- Contains: the generated `index.ts` API types and package metadata.
- Key files: `packages/api-interface/package.json`, `packages/api-interface/index.ts`

**`packages/cmd/`:**
- Purpose: Scaffolding tool for new modules.
- Contains: generator entry scripts and CMS-named templates for server/admin CRUD code.
- Key files: `packages/cmd/createCURD/index.js`, `packages/cmd/createCURD/createServer.js`, `packages/cmd/createCURD/createCms.js`

**`docs/ssr/`:**
- Purpose: Human documentation for the SSR architecture and Nest integration.
- Contains: implementation notes that mirror current architectural boundaries.
- Key files: `docs/ssr/react-ssr.md`, `docs/ssr/nestjs-ssr-integration.md`

## Key File Locations

**Entry Points:**
- `package.json`: root orchestration for dev/build/generator workflows.
- `server/src/main.ts`: backend process entry.
- `server/src/app.module.ts`: backend module graph root.
- `clients/admin/src/main.tsx`: admin browser entry.
- `clients/admin/src/router/router.ts`: admin router creation and base path.
- `clients/ssr/src/index.ts`: SSR package export entry.
- `packages/cmd/createCURD/index.js`: CRUD generator entry.

**Configuration:**
- `pnpm-workspace.yaml`: workspace package inclusion.
- `work.config.json`: admin URL segment (`cms_admin_path`).
- `server/tsconfig.json`: backend path aliases, including `@cms/ssr*`.
- `server/nest-cli.json`: Nest compiler settings.
- `clients/admin/rsbuild.config.ts`: admin build output, route-generation ignores, alias, proxy, base path.
- `clients/ssr/rsbuild.config.mts`: SSR build outputs and custom client-island plugin.
- `server/src/config/index.ts`: env-backed runtime config registration.

**Core Logic:**
- `server/src/modules/*`: backend feature implementations.
- `server/src/modules/render_view/*`: SSR rendering bridge.
- `clients/admin/src/routes/*`: admin page implementations.
- `clients/admin/src/store/*`: client state stores.
- `clients/ssr/src/pages/*`: public page implementations.
- `clients/ssr/src/runtime/*`: SSR runtime shell and hydration helpers.

**Testing:**
- `server/test/jest-e2e.json`: E2E Jest config.
- `server/test/`: backend test area.
- `server/src/**/*.spec.ts`: unit/spec tests when present.

## Naming Conventions

**Files:**
- Backend feature files use kebab_case module names with role suffixes: `news.service.ts`, `user_admin.controller.ts`, `render_view.decorator.tsx`.
- Admin routes mirror URL segments using TanStack naming rules: `clients/admin/src/routes/_main/news/list.tsx`, `clients/admin/src/routes/_main/public-article/update.$id.tsx`, `clients/admin/src/routes/_main/dict/$id.tsx`.
- Route-local helpers live under ignored folders named `module/`, `modules/`, or `*-module/`: `clients/admin/src/routes/_main/news/module/services.ts`, `clients/admin/src/routes/login/modules/services.ts`.
- SSR pages use folder-per-page with `index.tsx` or package barrels: `clients/ssr/src/pages/home/index.tsx`, `clients/ssr/src/pages/ssr-examples/index.ts`.

**Directories:**
- Backend module directories use snake_case names matching module/entity prefixes: `server/src/modules/user_admin`, `server/src/modules/content_translation`, `server/src/modules/file_manage`.
- Admin route directories primarily use kebab-case URL names with `_main` and `__root` as router control nodes: `clients/admin/src/routes/_main`, `clients/admin/src/routes/webhook-trans`.
- Shared package directories are capability-based: `packages/api-interface`, `packages/cmd`.

## Where to Add New Code

**New Backend Feature:**
- Primary code: `server/src/modules/<feature_name>/`
- Module registration: `server/src/app.module.ts`
- DTO/entity/service/controller: keep together inside the same module directory
- Shared helpers only if reused broadly: `server/src/common/` or `server/src/utils/`

**New Admin Screen:**
- Implementation: `clients/admin/src/routes/_main/<feature>/` for authenticated pages, or `clients/admin/src/routes/<feature>/` for public/auth routes
- Route-local API helpers: `clients/admin/src/routes/_main/<feature>/module/` or sibling `*-module/`
- Menu registration: `clients/admin/src/router/menu-config.ts`
- Shared client service only if used across multiple route groups: `clients/admin/src/services/`

**New Public SSR Page:**
- Page component: `clients/ssr/src/pages/<page>/index.tsx`
- Export barrel: `clients/ssr/src/pages/index.ts`
- Server route/controller integration: relevant Nest controller under `server/src/modules/*/*.controller.tsx`
- URL helper if reused: `clients/ssr/src/runtime/url.ts`

**New Shared Types:**
- Generated API types belong in `packages/api-interface/index.ts`
- Manual shared server constants exported to admin belong in `server/package.json` exports and source under `server/src/constants/index.ts`

**Utilities:**
- Backend reusable helpers: `server/src/utils/`
- Admin reusable view/components: `clients/admin/src/components/`, `clients/admin/src/utils/`, `clients/admin/src/hooks/`
- SSR runtime/shared helpers: `clients/ssr/src/runtime/`, `clients/ssr/src/utils/`

## Special Directories

**`clients/admin/src/.umi/`:**
- Purpose: generated Umi-era artifacts still present in the admin project.
- Generated: Yes
- Committed: Yes

**`clients/ssr/dist/`:**
- Purpose: SSR package build output for node/web/types.
- Generated: Yes
- Committed: Yes

**`server/dist/`:**
- Purpose: compiled backend output plus copied SSR/admin assets.
- Generated: Yes
- Committed: Yes

**`server/admin-ui/dist/`:**
- Purpose: admin SPA output served by Nest via `ServeStaticModule`.
- Generated: Yes
- Committed: Not determined from explored files

**`server/src/db/migrations/`:**
- Purpose: TypeORM migrations.
- Generated: Often generated
- Committed: Yes

**`packages/cmd/createCURD/template/`:**
- Purpose: code-generation source of truth for new CRUD modules.
- Generated: No
- Committed: Yes

## Structural Notes

**Backend module boundary:**
- Each module directory under `server/src/modules/` is the unit of ownership. Keep controllers thin and place query/update logic in the sibling service.

**Admin route boundary:**
- The routable surface is `clients/admin/src/routes/`, not `clients/admin/src/pages/`. New navigation should follow `src/routes/` unless explicitly cleaning or migrating legacy `src/pages/`.

**Admin helper boundary:**
- Keep route-private request wrappers and small UI helpers beside the route under ignored `module/` or `modules/` folders so the router plugin does not treat them as pages.

**SSR boundary:**
- Public page JSX belongs in `clients/ssr/src/pages/`, while request/auth/database access remains in Nest controllers and services under `server/src/modules/`.

**Package boundary:**
- Browser code relies on `@cms/api-interface` for DTOs and selectively imports constants from `@cms/server/const`. That means server package exports are part of the frontend contract.

## Rename Impact

- Root and package naming are embedded in `package.json`, `server/package.json`, `clients/admin/package.json`, and `clients/ssr/package.json`. Any rename should decide whether the `@cms/*` namespace is replaced or preserved as an internal package scope.
- Admin URL naming is centralized but sensitive: `work.config.json` defines `cms_admin_path`, then `clients/admin/rsbuild.config.ts`, `clients/admin/src/router/router.ts`, `server/src/app.module.ts`, `server/src/main.ts`, and `readme.md` all depend on it.
- Route names exposed to users and planners live in `clients/admin/src/routes/**/*`, `clients/admin/src/router/menu-config.ts`, and server public controllers like `server/src/modules/news/news.controller.tsx`, `server/src/modules/public_article/public_article.controller.tsx`, and `server/src/modules/result_page/result_page.controller.tsx`. Renaming business concepts later is easiest when route folder names and server path segments stay aligned.
- Server path aliases and package-export wiring are rename-sensitive in `server/tsconfig.json`, `clients/ssr/package.json`, and imports from `@cms/ssr/*` across `server/src/modules/render_view/*`, auth/file modules, and public page controllers.
- The generated/shared contract surface is name-sensitive in `packages/api-interface/package.json`, imports from `@cms/api-interface` across `clients/admin/src/**/*`, and Swagger generation in `server/src/utils/useSwagger.ts`.
- The code generator bakes the old naming into both directory names and imports: `packages/cmd/createCURD/createCms.js`, `packages/cmd/createCURD/template/cms/*`, and templates importing `@cms/api-interface` / `@cms/server/const`.
- SSR runtime identifiers still include `cms` in DOM markers and plugin names in `clients/ssr/src/runtime/client-component.tsx` and `clients/ssr/rsbuild.config.mts`. These are internal but become easy-to-miss leftovers after a brand/project rename.
- Legacy and transitional directories increase rename risk because stale names can persist unnoticed: `clients/admin/src/pages/`, `clients/admin/src/.umi/`, committed build outputs under `clients/ssr/dist/` and `server/dist/`, and docs under `docs/ssr/`.

---

*Structure analysis: 2026-03-26*
