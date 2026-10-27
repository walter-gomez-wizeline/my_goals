# ADR-007 — Local development and verification toolchain

Date: 2026-10-26. Status: selected for authorized TASK-003; no cloud deployment. Exact runtime/package versions are recorded in .nvmrc, package.json and package-lock.json rather than floating latest tags.

## Decision

- Node 24 LTS; verified local runtime 24.18.0, npm 11.16.0. npm is sufficient for one package; use npm ci and one portable package-lock.json.
- Next.js 16.4.3 App Router, React/React DOM 19.3.1 and TypeScript 5.9.3. TypeScript 5.9 is a deliberate compatible baseline rather than adopting the newer major outside the selected typescript-eslint peer range.
- ESLint 10.13.0 using @eslint/js 10.0.1, typescript-eslint 8.72.1 and @next/eslint-plugin-next 16.4.3. Do not use eslint-config-next here: its selected transitive React/import/accessibility plugins declared ESLint ranges excluding 10. The direct plugin configuration avoids overriding peers or using the deprecated ESLint 9 release. Full accessibility remains a QA requirement, not a claim of this lint configuration.
- pg 8.23.1 for parameterized SQL and explicit same-client transactions. No ORM. The server-only transaction utility commits/rolls back/releases; app ownership, receipt and session logic is not yet implemented.
- node-pg-migrate 9.0.0 (stable), plain SQL files and a separate migration URL. No business migration is included. Current website examples may describe 10 alpha; installed v9 behavior was exercised rather than assumed.
- Vitest 5.0.5 with Vite 8.3.5 for separate unit/real-PostgreSQL projects; @playwright/test 1.64.1 for desktop/mobile production-build smoke checks. Async server-component behavior is verified through a browser, not inferred from Vitest.
- PostgreSQL 17 local Docker image pinned by immutable manifest digest in compose.yaml. Verified server version 17.11. Hosted PostgreSQL version/region remains to qualify before provisioning. Persistent loopback development service and separate tmpfs test service. Runtime/migration roles are separate in the design; local container administrator credentials are tooling-only until TASK-004 establishes least-privilege roles.

## Boundaries

src/app is presentation. src/infrastructure/db contains a configuration guard and transaction utility. Framework-free domain/use-case modules are introduced when behavior exists; no speculative business interfaces/tables/auth handlers are generated in this task. Development page explicitly identifies unimplemented features.

Development CLI database commands reject remote hosts, wrong database names and URL query overrides. Integration tests require my_goals_test. They do not silently fall back to mocks or another database. Browser cloud credentials are not configured. npm dependencies and local Docker resources are not hosted infrastructure.

## Reproducibility and migration behavior

Use exact direct versions plus committed lockfile, no forced/legacy peer resolution. Regenerate lockfiles from a canonical working directory: npm --prefix against a macOS /tmp symlink produced nonportable path entries during setup; that generated lockfile was discarded and replaced. Final clean installation must pass npm ci.

The read-only db:migrate:status command reports applied metadata and SQL filenames. node-pg-migrate v9 up --dry-run can create its bookkeeping table, so it is separately named db:migrate:plan and documented as potentially writing metadata. Neither invents an application schema. Migration application is local-only through db:migrate; hosted release procedure belongs to TASK-013. No down/reset command is exposed by default.

## Evidence and follow-up

See [TASK-003 verification](../../docs/task-003-verification.md) for actual commands/results and limitations. GitHub Actions configuration supplies the same checks but has not yet run remotely. Supabase-specific identity, role policies, pooling, sessions and FS-01–13 require later implementation/integration tests. TASK-004 is next.

## Primary references checked

- [Node release status](https://nodejs.org/en/about/previous-releases)
- [Next installation and compatibility](https://nextjs.org/docs/app/getting-started/installation)
- [Vitest guide](https://vitest.dev/guide/)
- [node-postgres transaction contract](https://node-postgres.com/features/transactions)
- [node-pg-migrate documentation](https://salsita.github.io/node-pg-migrate/), qualified against installed stable 9.0.0 README/template/API
- [Playwright setup](https://playwright.dev/docs/intro)

Package engines/peers were also queried from npm before pinning and verified through actual installation/checks. No elapsed-time or scalability guarantee is inferred from these choices.
