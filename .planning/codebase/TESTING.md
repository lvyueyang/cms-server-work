# Testing Patterns

**Analysis Date:** 2026-03-26

## Test Framework

**Runner:**
- Jest 29 with `ts-jest`, configured in `server/package.json`.
- Separate E2E config exists in `server/test/jest-e2e.json`.

**Assertion Library:**
- Jest built-in assertions plus Supertest in `server/test/app.e2e-spec.ts`.

**Run Commands:**
```bash
cd server && pnpm test            # Run Jest with the package.json config
cd server && pnpm test:watch      # Watch mode
cd server && pnpm test:cov        # Coverage output to server/coverage
cd server && pnpm test:e2e        # E2E config from server/test/jest-e2e.json
```

## Test File Organization

**Location:**
- Only server-side tests are detected.
- The current E2E test lives under `server/test/app.e2e-spec.ts`.
- No unit test files (`*.spec.ts`) or frontend test files were detected in `clients/admin`, `clients/ssr`, or `packages/*`.

**Naming:**
- E2E tests follow `*.e2e-spec.ts`, as required by `server/test/jest-e2e.json`.
- The unit-test regex in `server/package.json` expects `*.spec.ts`.

**Structure:**
```text
server/test/
  app.e2e-spec.ts
  jest-e2e.json
```

## Test Structure

**Suite Organization:**
```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
```

**Patterns:**
- Build a real Nest application with `Test.createTestingModule(...)` and `createNestApplication()` in `server/test/app.e2e-spec.ts`.
- Initialize once in `beforeAll` and close in `afterAll`.
- Exercise HTTP behavior through `request(app.getHttpServer())`.
- No shared test helpers, custom matchers, or reusable factory utilities were detected.

## Mocking

**Framework:** Jest mocking APIs are available through Jest, but no active mocks were detected in the repository.

**Patterns:**
```typescript
const moduleFixture = await Test.createTestingModule({
  imports: [AppModule],
}).compile();
```

**What to Mock:**
- No repository-level convention is established because no examples of `jest.mock`, `jest.spyOn`, `overrideProvider`, or provider stubs were found under `server`, `clients`, or `packages`.
- For new unit tests, prefer mocking injected providers at the Nest testing-module boundary instead of hitting TypeORM, S3, SMTP, or external services directly, because production services in `server/src/modules/user_admin/user_admin.service.ts`, `server/src/modules/validate_code/validate_code.service.ts`, and `server/src/modules/webhook_trans/webhook_trans.service.ts` depend on infrastructure.

**What NOT to Mock:**
- Keep full-stack request/response behavior real in E2E tests, matching the existing `server/test/app.e2e-spec.ts` pattern.

## Fixtures and Factories

**Test Data:**
```typescript
request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
```

**Location:**
- No fixtures, factories, builders, or seeded test-data helpers were detected.

## Coverage

**Requirements:** None enforced beyond Jest collection settings in `server/package.json`.

**View Coverage:**
```bash
cd server && pnpm test:cov
open server/coverage/lcov-report/index.html
```

- `server/package.json` collects coverage from `**/*.(t|j)s` and writes to `server/coverage`.
- The current Jest config sets `roots` to `<rootDir>/apps/` in `server/package.json`, but no `server/apps/` directory exists. This is naming/configuration debt that can suppress expected unit test discovery until corrected.

## Test Types

**Unit Tests:**
- Not detected.
- The repo has service/controller/module seams suitable for unit testing, but there are no examples under `server/src/modules/*` or `clients/admin/src/**/*`.

**Integration Tests:**
- Not detected as a separate layer.
- The single E2E test behaves like a high-level integration smoke test by booting `AppModule`.

**E2E Tests:**
- Jest + Supertest, configured by `server/test/jest-e2e.json`.
- Current scope is minimal and does not cover auth, DTO validation, generated CRUD modules, SSR rendering, or admin request flows.

## Common Patterns

**Async Testing:**
```typescript
beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});
```

**Error Testing:**
```typescript
// No repository example detected.
// Add new tests with Supertest status assertions, for example:
// return request(app.getHttpServer()).post('/api/admin/login').send(body).expect(400);
```

## Testing Gaps Relevant To Rename

- No tests exercise workspace package import names such as `@cms/server`, `@cms/ssr`, or `@cms/api-interface`, so package renames can break builds without a dedicated test failing first.
- No tests cover SSR bootstrap markers from `clients/ssr/src/runtime/document.tsx` and `clients/ssr/src/runtime/client-component.tsx`, so renaming `__CMS_SSR_DATA__` or `data-cms-client-*` requires explicit regression coverage.
- No tests cover config-driven admin mount paths using `cms_admin_path` in `server/src/utils/index.ts`, `server/src/main.ts`, `clients/admin/rsbuild.config.ts`, and `clients/admin/src/router/router.ts`.
- No tests cover generated outputs from `packages/api-interface/gen.js` or `packages/cmd/createCURD/*`, so rename work that changes package names or output locations needs manual verification or new smoke tests.

## Rename impact

- Package and import rename verification must cover `package.json`, `server/package.json`, `clients/admin/package.json`, `clients/ssr/package.json`, and all source imports using `@cms/*`.
- The server E2E harness should be extended to cover renamed SSR integration points in `server/src/main.ts`, `server/src/modules/render_view/render_view.service.tsx`, and `server/src/common/filters/all-exceptions.filter.ts`.
- Future rename tests should assert admin routing and asset paths after changing `cms_admin_path`, especially through `clients/admin/src/router/router.ts`, `clients/admin/rsbuild.config.ts`, and `server/src/app.module.ts`.
- Documentation-backed commands that mention old package names in `docs/ssr/react-ssr.md` and `docs/ssr/nestjs-ssr-integration.md` are not validated by tests today.

---

*Testing analysis: 2026-03-26*
