# Coding Conventions

**Analysis Date:** 2026-03-26

## Naming Patterns

**Files:**
- Use `kebab-case` for most source files in `server/src/modules/*` such as `server/src/modules/user_admin/user_admin.service.ts`, `server/src/modules/business_config/business_config.controller.ts`, and `server/src/modules/render_view/render_view.interceptor.ts`.
- Use route-file naming that encodes URL segments in `clients/admin/src/routes`, including special names like `_main.tsx`, `update.$id.tsx`, and `$id.tsx` in `clients/admin/src/routes/_main/public-article/update.$id.tsx` and `clients/admin/src/routes/_main/dict/$id.tsx`.
- Keep React component directories on `index.tsx` entry files in `clients/admin/src/components/PageTable/index.tsx`, `clients/admin/src/components/Layout/index.tsx`, and `clients/ssr/src/components/Header/index.tsx`.
- Treat generated files as immutable when they say so. `clients/admin/src/routeTree.gen.ts` is explicitly auto-generated and should not be hand-edited.

**Functions:**
- Use `camelCase` for functions and methods such as `userAdminLogin` in `server/src/modules/auth/auth.service.ts`, `getUserInfo` in `clients/admin/src/services/user.ts`, and `createCms` in `packages/cmd/createCURD/createCms.js`.
- Prefix boolean-returning helpers and flags with `is`, `has`, or similar when present, e.g. `hasRootUser` in `clients/admin/src/routes/login/modules/services.ts`, `isPublicPath` in `clients/admin/src/router/auth.ts`, and `isDevSynchronizeEnabled` in `server/src/db/sqlite-options.ts`.

**Variables:**
- Use `camelCase` for locals and state, e.g. `roleModal`, `submitLoading`, `searchForm` in `clients/admin/src/routes/_main/user-admin/user-list.tsx`.
- Preserve snake_case only when matching API payloads or persisted fields, e.g. `out_login_date` in `server/src/modules/user_admin/user_admin.controller.ts`, `page_size` in `clients/admin/src/routes/_main/user-admin/user-list.tsx`, and `cms_admin_path` in `server/src/utils/index.ts`.

**Types:**
- Use `PascalCase` for classes, DTOs, entities, and React page components such as `UserAdminService` in `server/src/modules/user_admin/user_admin.service.ts`, `UserAdminCreateDto` in `server/src/modules/user_admin/user_admin.dto.ts`, and `HomePage` in `clients/ssr/src/pages/home/index.tsx`.
- The codebase prefers `class` for DTOs and response wrappers in Nest modules, for example `UserAdminListResponseDto` in `server/src/modules/user_admin/user_admin.dto.ts`.
- Use `type` aliases for frontend unions and convenience types, e.g. `TableItem` in `clients/admin/src/routes/_main/user-admin/user-list.tsx` and `AppNavigableRoutePath` in `clients/admin/src/router/menu-config.ts`.

## Code Style

**Formatting:**
- Use Biome from `biome.json` as the formatter and import organizer.
- Use tabs and double quotes where Biome is applied, per `biome.json`.
- Expect mixed formatting in the current tree. `server/src/main.ts` and `server/src/app.module.ts` follow tabs and double quotes, while older files such as `server/src/modules/auth/auth.service.ts` and `clients/admin/src/main.tsx` still use spaces and single quotes.

**Linting:**
- Use Biome lints from `biome.json`; `recommended` is enabled.
- `useImportType` is intentionally disabled, so value imports are common even for type-only usage.
- Several permissive rules are disabled in `biome.json`, including `a11y.useValidAnchor`, `security.noDangerouslySetInnerHtml`, and `suspicious.noConstEnum`.
- Generated code is allowed to bypass normal checks. `clients/admin/src/routeTree.gen.ts` disables linting and type checking at the top of the file.

## Import Organization

**Order:**
1. Node built-ins first, usually with `node:` specifiers, e.g. `import { dirname, join } from "node:path";` in `server/src/main.ts`.
2. Third-party packages next, e.g. `@nestjs/*`, `axios`, `antd`, `@tanstack/react-router`.
3. Internal alias imports next, usually `@/` in app code and `@cms/*` for workspace packages, e.g. `import { successResponse } from "@/utils";` in `server/src/modules/auth/auth.controller.ts`.
4. Relative imports last, e.g. `import { AuthService } from "./auth.service";` in `server/src/modules/auth/auth.controller.ts`.

**Path Aliases:**
- `@/*` maps to `src/*` in `server/tsconfig.json` and `clients/ssr/tsconfig.json`.
- Workspace package names are part of normal import style: `@cms/api-interface`, `@cms/server/const`, and `@cms/ssr/pages` appear throughout `clients/admin/src/**/*` and `server/src/**/*`.
- Server-side SSR imports rely on `server/tsconfig.json` path mappings for `@cms/ssr`, `@cms/ssr/pages`, `@cms/ssr/helpers`, and `@cms/ssr/server`.

## Error Handling

**Patterns:**
- Throw Nest exceptions directly from services and controllers. `BadRequestException`, `UnauthorizedException`, `NotFoundException`, and `InternalServerErrorException` appear in `server/src/modules/user_admin/user_admin.service.ts`, `server/src/modules/logger/logger.controller.ts`, and `server/src/modules/user_admin/user_admin.controller.ts`.
- Return successful API payloads through `successResponse(...)`, used broadly in controllers such as `server/src/modules/user_admin/user_admin.controller.ts`, `server/src/modules/banner/banner.controller.ts`, and generated templates in `packages/cmd/createCURD/template/server/xx.controller.tpl`.
- Wrap unexpected server failures with centralized filters. `server/src/common/filters/all-exceptions.filter.ts` logs exceptions and renders SSR error pages for non-API 500s.
- Frontend request errors flow through Axios interceptors in `clients/admin/src/request/request.ts`, which display notifications and redirect to `/login` on 401 unless explicitly suppressed.
- Tuple-style async handling is used in some frontend helpers. `awaitRequest` in `clients/admin/src/request/request.ts` returns `[err, result]`.

## Logging

**Framework:** Winston through `LoggerService`

**Patterns:**
- Inject `LoggerService` into Nest services/controllers instead of using `console.log` for routine application logging, as shown in `server/src/modules/auth/auth.service.ts` and `server/src/modules/user_admin/user_admin.controller.ts`.
- Logger output is split by concern in `server/src/modules/logger/logger.service.ts` into `error.log`, `warn.log`, `access.log`, and `combined.log`, with trace IDs from `server/src/common/cls.store.ts`.
- Console logging still exists in bootstrap, scripts, generators, and some feature code such as `server/src/main.ts`, `server/src/modules/content_translation/content_translation.service.ts`, `clients/admin/src/services/user.ts`, and `clients/admin/src/routes/_main/system-config/index.tsx`. Treat these as current exceptions, not the preferred app-layer pattern.

## Comments

**When to Comment:**
- Comments are sparse and mostly used to mark intent or disabled code paths, for example `// 参数验证` in `server/src/main.ts`, `// 邮箱换绑` in `server/src/modules/user_admin/user_admin.dto.ts`, and commented-out UI blocks in `clients/admin/src/routes/_main/user-admin/user-list.tsx`.
- Generated or infrastructure files use header comments to declare ownership, such as `clients/admin/src/routeTree.gen.ts`.

**JSDoc/TSDoc:**
- Full JSDoc/TSDoc is not a common pattern.
- Short Chinese block comments are used in DTO files and CRUD templates, e.g. `/** 查询 */` and `/** 创建 */` in `server/src/modules/user_admin/user_admin.dto.ts` and `packages/cmd/createCURD/template/cms/module/services.tpl`.

## Function Design

**Size:** 
- Service methods are usually small and single-purpose in CRUD modules such as `server/src/modules/banner/banner.service.ts` and `server/src/modules/user_admin/user_admin.service.ts`.
- Controllers can become long when they aggregate multiple related endpoints, as in `server/src/modules/user_admin/user_admin.controller.ts`.

**Parameters:** 
- Nest controllers accept DTO classes via `@Body()` and decorator-injected context such as `@UserByAdmin()` in `server/src/modules/user_admin/user_admin.controller.ts`.
- Frontend service modules usually take one DTO body object per API, as in `clients/admin/src/routes/_main/news/module/services.ts`.
- React helpers often accept config objects rather than many positional parameters, e.g. the optional `options` object in `clients/admin/src/services/user.ts`.

**Return Values:** 
- Server services usually return ORM results or tuples and let controllers wrap them. Examples: `findAndCount` in `server/src/modules/user_admin/user_admin.service.ts` and `[UserAdmin | null, string | null]` tuples in `server/src/modules/auth/auth.service.ts`.
- Frontend request wrappers return raw Axios promises typed with DTO response classes, as in `clients/admin/src/routes/login/modules/services.ts` and `clients/admin/src/routes/_main/news/module/services.ts`.

## Module Design

**Exports:** 
- Nest server code follows module folders with `*.module.ts`, `*.service.ts`, `*.controller.ts`, `*.dto.ts`, and `*.entity.ts`, visible across `server/src/modules/*`.
- SSR runtime uses barrel exports from `clients/ssr/src/index.ts`.
- Frontend reusable services also use barrel exports in places like `clients/admin/src/services/index.ts` and route-local `module/services.ts` files.

**Barrel Files:** 
- Use barrel exports selectively. Examples include `clients/ssr/src/index.ts`, `clients/admin/src/router/index.ts`, `clients/admin/src/request/index.ts`, and `server/src/utils/index.ts`.
- Do not add barrel files for generated router output; `clients/admin/src/routeTree.gen.ts` is regenerated by tooling.

## Generated Code

- Treat `clients/admin/src/routeTree.gen.ts` as generated TanStack Router output.
- Treat `packages/api-interface/index.ts` as generated from Swagger; generation is driven by `packages/api-interface/gen.js`.
- Treat files emitted by `packages/cmd/createCURD/*` as template-driven scaffolding. The generator still targets `clients/admin/src/pages` in `packages/cmd/createCURD/createCms.js`, while the live admin app uses `clients/admin/src/routes`, so generated frontend code requires manual adaptation.

## Commit Rules

- Use simplified Chinese commit messages per `AGENTS.md`.
- Follow `<类型>(模块): <描述>` or `<类型>: <描述>`, with allowed types `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, and `chore` from `AGENTS.md`.
- Keep rename work split by scope so package renames, import rewrites, and generated artifact refreshes can be reviewed independently.

## Rename impact

- Workspace package names are rename-sensitive in `package.json`, `server/package.json`, `clients/admin/package.json`, and `clients/ssr/package.json` because imports use `@cms/*`.
- TS path aliases and SSR package resolution are rename-sensitive in `server/tsconfig.json`, `server/src/main.ts`, and `server/src/modules/render_view/render_view.service.tsx`.
- Generated and generated-like files embed the old name: `clients/admin/src/routeTree.gen.ts`, `packages/api-interface/gen.js`, and `clients/ssr/rsbuild.config.mts` (`cms-ssr-use-client` plugin name).
- Runtime DOM/storage keys are naming-sensitive in `clients/ssr/src/runtime/document.tsx`, `clients/ssr/src/runtime/client-component.tsx`, and `clients/ssr/src/components/SsrExamplesLab/index.tsx` via `__CMS_SSR_DATA__`, `data-cms-client-*`, and `cms:ssr-examples:form`.
- Config keys and printed URLs embed legacy naming in `server/src/utils/index.ts`, `server/src/main.ts`, and `clients/admin/src/router/router.ts` via `cms_admin_path`.
- Logging and secret-like constants embed the old project name in `server/src/modules/logger/logger.service.ts` (`service: 'cms-server'`), `server/src/modules/validate_code/validate_code.service.ts` (`cms2023`), and `server/src/utils/index.ts` (`cms_admin_iv_2025`).
- Documentation and examples contain hard-coded `@cms/*` references in `docs/ssr/react-ssr.md` and `docs/ssr/nestjs-ssr-integration.md`.
- The CRUD generator templates are rename-sensitive in `packages/cmd/createCURD/template/cms/index.tpl`, `packages/cmd/createCURD/template/cms/module/services.tpl`, and `packages/cmd/createCURD/createCms.js`.
- There is an explicit rule against `uuid` in `AGENTS.md`, but rename work should also clean the remaining violation in `clients/admin/src/routes/_main/webhook-trans/index.tsx` and the root dependency in `package.json`.

---

*Convention analysis: 2026-03-26*
