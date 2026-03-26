# Codebase Concerns

**Analysis Date:** 2026-03-26

## Tech Debt

**Cross-package rename coupling:**
- Issue: Project naming is embedded in workspace package names, path aliases, SSR runtime identifiers, admin route config, generator templates, and docs. A rename is not a single metadata change.
- Files: `package.json`, `server/package.json`, `clients/admin/package.json`, `clients/ssr/package.json`, `packages/api-interface/package.json`, `server/tsconfig.json`, `server/src/main.ts`, `server/src/app.module.ts`, `server/src/utils/index.ts`, `clients/admin/rsbuild.config.ts`, `clients/admin/src/router/router.ts`, `clients/ssr/src/runtime/client-component.tsx`, `clients/ssr/src/runtime/document.tsx`, `clients/ssr/rsbuild.config.mts`, `work.config.json`, `packages/cmd/createCURD/createCms.js`, `packages/cmd/createCURD/template/cms/*.tpl`, `docs/ssr/react-ssr.md`, `docs/ssr/nestjs-ssr-integration.md`, `docs/ssr/react-ssr-architecture.md`, `readme.md`
- Impact: Partial renames will break workspace resolution, SSR bootstrapping, admin routing, generated CRUD code, and operator runbooks.
- Fix approach: Centralize product naming into a single config contract, rename workspace package scopes in one pass, then update runtime constants, generators, docs, and deployment references together.

**Generated interface file is oversized and hand-edit hostile:**
- Issue: `packages/api-interface/index.ts` is a 2638-line generated surface area that couples admin and server contracts into one file.
- Files: `packages/api-interface/index.ts`, `packages/api-interface/gen.js`, `server/src/utils/useSwagger.ts`
- Impact: Regeneration risk is high, diffs are noisy, and renaming package scope or import paths can invalidate a large portion of the codebase at once.
- Fix approach: Keep the file generated-only, document regeneration as part of build/release, and split outputs if the contract surface keeps growing.

**Large mixed-responsibility controllers/services:**
- Issue: SSR, demo data, admin pages, and integration logic accumulate in very large files.
- Files: `server/src/modules/home/home.controller.tsx`, `server/src/modules/render_view/render_view.service.tsx`, `clients/admin/src/routes/_main/webhook-trans/index.tsx`, `clients/admin/src/components/GrapesjsEditor/plugins/assetManager/index.ts`
- Impact: These files are fragile to modify, difficult to review, and likely to hide rename regressions because constants, UI labels, runtime paths, and business logic are mixed together.
- Fix approach: Extract runtime constants, demo fixtures, data loaders, and view components into smaller files with narrow responsibilities.

**Documented conventions do not match actual dependencies:**
- Issue: Repository guidance forbids `uuid`, but runtime code still depends on it in the admin app and the root manifest still installs it.
- Files: `AGENTS.md`, `package.json`, `clients/admin/src/routes/_main/webhook-trans/index.tsx`
- Impact: Team guidance is unreliable, and automated refactors based on the documented standard can miss live code paths.
- Fix approach: Remove `uuid` usage in favor of `randomUUID`, then update lockfile and dependency manifests.

**No automated test suite present in active packages:**
- Issue: Test commands exist, but no `.spec` or `.test` files were detected under `server/`, `clients/`, or `packages/`.
- Files: `server/package.json`, `clients/admin/package.json`, `clients/ssr/package.json`
- Impact: Rename work, auth changes, SSR routing changes, and integration config edits will rely on manual verification.
- Fix approach: Add smoke coverage first for auth, file download, SSR bootstrapping, webhook forwarding, and config loading.

## Known Bugs

**Image captcha expiry is effectively broken:**
- Symptoms: Image captcha hashes do not expire after the intended 5 minutes.
- Files: `server/src/modules/validate_code/validate_code.service.ts`
- Trigger: `createHashCode()` stores `expire_date` as `dayjs().add(5, "minutes").unix()` in seconds, but `validate()` checks `dayjs(expire_date).isAfter(dayjs())`, which interprets the stored value as a millisecond timestamp.
- Workaround: None in code. The only protection left is matching the captcha text itself.

**Email verification can crash after startup with missing mail config:**
- Symptoms: Service starts even when mail config is absent, but sending email later can fail because `mailClient` was never initialized.
- Files: `server/src/modules/validate_code/validate_code.service.ts`
- Trigger: `ValidateCodeByEmailService` returns early when `EMAIL_HOST` is missing, yet `createAndSendCode()` still assumes a live transporter.
- Workaround: Ensure all email env vars are configured before enabling password reset or bind-email flows.

**Admin file lookup helpers contain unreachable not-found checks:**
- Symptoms: `findByID`, `findByName`, and `findByHash` do not throw when the repository returns a promise that resolves to `null`.
- Files: `server/src/modules/file_manage/file_manage.service.ts`
- Trigger: These methods omit `await` before the truthiness check.
- Workaround: Call the awaited `findById()` path instead where available.

## Security Considerations

**Webhook relay executes stored code with `new Function`:**
- Risk: Admin-entered webhook transformation code is evaluated at runtime. The wrapper limits globals, but this is not a hardened sandbox.
- Files: `server/src/utils/sendBox.ts`, `server/src/modules/webhook_trans/webhook_trans.service.ts`, `clients/admin/src/routes/_main/webhook-trans/index.tsx`
- Current mitigation: A whitelist of built-in globals is injected into the generated function body.
- Recommendations: Replace dynamic execution with declarative transforms or isolate execution in a real sandbox/process boundary with timeouts and resource limits.

**CSRF protection is disabled while auth accepts cookies:**
- Risk: Requests can authenticate via the `token` cookie, but `csurf` is commented out.
- Files: `server/src/main.ts`, `server/src/modules/auth/auth.guard.ts`
- Current mitigation: None detected beyond route guards.
- Recommendations: Re-enable CSRF for cookie-authenticated flows or enforce header-only bearer tokens for state-changing endpoints.

**Validation pipe is permissive by default:**
- Risk: `ValidationPipe` is enabled without `whitelist`, `forbidNonWhitelisted`, or `transform`.
- Files: `server/src/main.ts`
- Current mitigation: DTO decorators exist on many endpoints.
- Recommendations: Enable strict request payload sanitization to reduce accidental overposting and schema drift.

**Hard-coded crypto secrets are embedded in source:**
- Risk: Captcha encryption key and AES IV include product-specific literals committed in source.
- Files: `server/src/modules/validate_code/validate_code.service.ts`, `server/src/utils/index.ts`
- Current mitigation: None beyond code obscurity.
- Recommendations: Move these values to environment configuration, rotate on deployment, and decouple them from product naming.

**Log file endpoints trust weak path params:**
- Risk: Logger endpoints pass raw `date` and `filename` params into filesystem paths with only `IsNotEmpty` validation.
- Files: `server/src/modules/logger/logger.controller.ts`, `server/src/modules/logger/logger.dto.ts`
- Current mitigation: Paths are joined under `getLogDirPath()`, but there is no regex or normalization guard.
- Recommendations: Restrict `date` and `filename` to strict patterns and reject path traversal characters explicitly.

## Performance Bottlenecks

**SSR render path reloads large runtime structures in a single service:**
- Problem: `RenderViewService` owns SSR manifest caching, translation caching, global config loading, current-user lookup, and stream rendering.
- Files: `server/src/modules/render_view/render_view.service.tsx`
- Cause: A single service sits on multiple hot-path responsibilities for every page render.
- Improvement path: Split manifest loading, i18n cache, global data cache, and request-specific rendering into separate units with explicit refresh semantics.

**Large log files are fully loaded into memory for admin viewing:**
- Problem: The log detail endpoint reads entire files via `readFileSync`.
- Files: `server/src/modules/logger/logger.controller.ts`
- Cause: File content is loaded eagerly and then split into lines.
- Improvement path: Paginate by tailing or streaming log chunks instead of loading whole files.

**File upload path uses sync disk write in request flow:**
- Problem: Upload writes use `fse.writeFileSync` inside an async request handler.
- Files: `server/src/modules/file_manage/file_manage.service.ts`
- Cause: Synchronous filesystem I/O blocks the event loop under concurrent uploads.
- Improvement path: Switch to async writes and consider background processing for metadata extraction.

## Fragile Areas

**Build output path contract between admin and server:**
- Files: `clients/admin/rsbuild.config.ts`, `server/src/app.module.ts`
- Why fragile: Admin build output is written into `server/admin-ui/dist`, while Nest serves `join(process.cwd(), "admin-ui/dist")`. This only works if runtime cwd and copied filesystem layout match the Docker/manual deployment expectation exactly.
- Safe modification: Change both producer and consumer paths together, then validate local dev, Docker image, and production startup.
- Test coverage: No automated asset-serving checks detected.

**SSR package resolution depends on workspace names and local source aliases:**
- Files: `server/src/main.ts`, `server/src/modules/render_view/render_view.service.tsx`, `server/tsconfig.json`, `clients/ssr/package.json`
- Why fragile: Runtime uses `require.resolve("@cms/ssr/package.json")` while TypeScript compilation maps `@cms/ssr*` aliases directly to `clients/ssr/src/index.ts`.
- Safe modification: Rename package scope, runtime `require.resolve`, and TS path aliases in one atomic change.
- Test coverage: No SSR smoke tests detected.

**Config loading assumes repository-relative file layout:**
- Files: `server/src/utils/index.ts`, `work.config.json`
- Why fragile: `getWorkConfig()` reads `../work.config.json` relative to `process.cwd()`, not relative to the module file.
- Safe modification: Resolve config from a known application root or inject via env/config module.
- Test coverage: No startup config tests detected.

**Swagger type generation runs shell commands from app startup:**
- Files: `server/src/utils/useSwagger.ts`, `packages/api-interface/gen.js`
- Why fragile: Dev startup shells out with `exec("cd ... && npm run gen")`, coupling local tooling, cwd, and package manager availability.
- Safe modification: Move generation to an explicit script or build step rather than an application side effect.
- Test coverage: No dev-tooling tests detected.

## Scaling Limits

**Local filesystem storage for logs and uploads:**
- Current capacity: Bound to a single node filesystem rooted at `FILE_DATA_DIR_PATH`.
- Limit: Horizontal scaling, ephemeral containers, and rename-related volume migration become operationally risky because logs and uploads are not abstracted behind a storage service by default.
- Scaling path: Standardize on S3-compatible storage for uploads and external log shipping before multi-node deployment.

**SQLite default runtime database:**
- Current capacity: Single-file SQLite configured through `DATABASE_PATH`.
- Limit: Concurrent writes, multi-instance deployment, and zero-downtime rollout are constrained compared to a networked database.
- Scaling path: Use the provided MySQL-to-SQLite migration script as historical evidence of database transitions, but define a stable production database target and migration policy before major product renaming/deployment changes.

## Dependencies at Risk

**Local tarball dependency for `xlsx`:**
- Risk: The server depends on `xlsx` through a checked-in local tarball instead of a registry-pinned package.
- Files: `server/package.json`, `local_packages/xlsx-0.20.3.tgz`
- Impact: Build portability and dependency provenance are weaker, especially during CI/CD setup or repository rename/move.
- Migration plan: Replace with a normal registry dependency or document why the patched tarball is required and how it is rebuilt.

## Missing Critical Features

**No CI/CD definition detected in repository:**
- Problem: No `.github/workflows/*`, `.gitlab-ci*`, `Jenkinsfile`, or compose/deployment manifests were detected in the repository root scan.
- Blocks: Safe large-scale rename verification, reproducible builds, and automated regression checks across monorepo packages.

**No documented rename checklist or compatibility layer:**
- Problem: Current docs explain SSR and setup, but there is no canonical rename/migration procedure for package scopes, URLs, storage paths, or secrets.
- Blocks: Coordinated project rebrand without breaking operators or downstream consumers.

## Test Coverage Gaps

**Authentication and session boundary are untested:**
- What's not tested: Admin token validation, client redirect behavior, cookie-vs-header token handling, and logout invalidation.
- Files: `server/src/modules/auth/auth.guard.ts`, `server/src/modules/auth/auth.service.ts`
- Risk: Rename or security hardening can silently break login flows.
- Priority: High

**SSR bootstrap and asset injection are untested:**
- What's not tested: `require.resolve("@cms/ssr/package.json")`, manifest loading, `__CMS_SSR_DATA__` injection, and `/_fe_/` asset serving.
- Files: `server/src/main.ts`, `server/src/modules/render_view/render_view.service.tsx`, `clients/ssr/src/runtime/document.tsx`, `clients/ssr/src/runtime/client-component.tsx`
- Risk: Product rename can break public pages and hydration without immediate detection.
- Priority: High

**Third-party integrations are untested:**
- What's not tested: S3 upload path, email delivery, Aliyun SMS sending, and webhook relay behavior.
- Files: `server/src/modules/user_admin/user_admin.service.ts`, `server/src/modules/validate_code/validate_code.service.ts`, `server/src/modules/webhook_trans/webhook_trans.service.ts`
- Risk: Environment or naming changes can break production integrations with no safety net.
- Priority: High

**Admin build/runtime coupling is untested:**
- What's not tested: Admin build output to `server/admin-ui/dist`, Nest static hosting, and `cms_admin_path` routing.
- Files: `clients/admin/rsbuild.config.ts`, `server/src/app.module.ts`, `clients/admin/src/router/router.ts`, `work.config.json`
- Risk: A rename of route prefix or project layout can break the entire admin UI deployment.
- Priority: High

## Rename Impact

**Naming-sensitive locations to audit before renaming:**
- Workspace/package scope: `package.json`, `server/package.json`, `clients/admin/package.json`, `clients/ssr/package.json`, `packages/api-interface/package.json`
- TS/runtime imports: `server/tsconfig.json`, `server/src/main.ts`, `server/src/modules/render_view/render_view.service.tsx`, all `@cms/*` imports under `server/src/`, `clients/admin/src/`, `packages/cmd/createCURD/template/cms/*.tpl`
- Admin URL prefix and initialization URL: `work.config.json`, `server/src/app.module.ts`, `server/src/main.ts`, `clients/admin/rsbuild.config.ts`, `clients/admin/src/router/router.ts`, `readme.md`
- SSR payload and DOM contract: `clients/ssr/src/runtime/client-component.tsx`, `clients/ssr/src/runtime/document.tsx`, `docs/ssr/react-ssr.md`, `docs/ssr/react-ssr-architecture.md`
- Generated artifacts and generators: `packages/api-interface/index.ts`, `packages/api-interface/gen.js`, `packages/cmd/createCURD/createCms.js`, `packages/cmd/createCURD/template/cms/*.tpl`, `clients/admin/src/routeTree.gen.ts`
- Storage and deployment naming: `readme.md` (`FILE_DATA_DIR_PATH="~/node_server_data/cms_server"`), `server/src/modules/logger/logger.service.ts` (`service: "cms-server"`), `server/src/utils/index.ts` (`cms_admin_iv_2025`), `server/src/modules/validate_code/validate_code.service.ts` (`cms2023`)
- Demo content and user-visible strings: `server/src/modules/home/home.controller.tsx`, `clients/ssr/src/components/Header/index.tsx`, `clients/ssr/src/components/SsrExamplesLab/index.tsx`
- Docs drift risk: `AGENTS.md`, `readme.md`, `docs/ssr/react-ssr.md`, `docs/ssr/nestjs-ssr-integration.md`, `docs/ssr/react-ssr-architecture.md`
- Deployment coupling not codified in repo: CI/CD definitions were not detected, so external pipelines, image names, env groups, database names, S3 buckets, mail sender identities, and secret stores must be inventoried outside the repository before executing the rename.

---

*Concerns audit: 2026-03-26*
