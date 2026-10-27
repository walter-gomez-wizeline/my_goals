# TASK-003 — Verification evidence

Date: 2026-10-26. Owner: Focus; developer and architect supplied read-only tooling recommendations; QA performed independent scaffold/configuration reviews. Scope: runnable local foundation, not business functionality.

## Delivered

- Exact package versions/portable npm lockfile; Node 24.18.0 and npm 11.16.0 baseline.
- Next.js development/production foundation page; no misleading journal or account behavior.
- ESLint/TypeScript configuration, Vitest unit and real-PG projects, Playwright desktop/mobile smoke configuration.
- Server-only same-client transaction utility and guarded local database configuration.
- Digest-pinned PostgreSQL 17 Compose services; persistent development and disposable test database.
- Stable node-pg-migrate 9 runner with separate runtime/migration configuration, read-only status and explicitly qualified planning command.
- Synthetic .env.example, maintained setup instructions and proposed GitHub Actions checks. No hosted credentials/resources.

## Executed evidence

| Check | Outcome |
| --- | --- |
| Exact npm package engines/peers and npm ls --depth=0 | Verified chosen direct versions; incompatible broader ESLint config replaced with supported direct plugin composition |
| npm ci from clean generated dependencies | Passed after regenerating lockfile from canonical path; no local-path lock entries |
| npm run lint | Passed with zero warnings from ESLint |
| npm run typecheck | Next route type generation and TypeScript passed |
| npm test | 13 unit checks passed (local DB guard and bounded pool configuration) |
| npm run build | Optimized Next.js 16.4.3 production build passed |
| npm run db:check | Connected to isolated my_goals_dev, PostgreSQL 17.11 |
| npm run db:migrate:status | Read-only applied/source lists empty, as expected before TASK-004 |
| npm run db:migrate:plan | Runner completed with zero pending application migrations; metadata bookkeeping may be initialized |
| npm run test:integration | 2 real-PostgreSQL transaction tests passed: commit/release and rollback/reusable pool |
| npm run test:smoke | 2 Playwright checks passed: production foundation at desktop 1280 px and mobile 360 px, no horizontal document overflow |
| QA final source/config review | No remaining material foundation blockers; no application security claim |

Browser verification used the explicit PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH pointing to an already installed Chrome. Other contributors normally install Playwright Chromium through the documented command; a bundled-browser download was not needed to establish these local results. CI configuration has not yet executed remotely.

## Reproducible commands

Follow CONTRIBUTING.md for .env.local creation and local PostgreSQL startup. Then:

```sh
npm ci
npm run check
npm run db:check
npm run db:migrate:status
npm run db:migrate:plan
npm run test:integration
npx playwright install chromium
npm run test:smoke
```

The separate browser-install command is a prerequisite for the normal bundled-Chromium path, not a claim it was executed during the explicit-Chrome verification. Stop only this project's containers with npm run db:stop when finished; this preserves development volume data. Test data is disposable.

## Findings corrected during setup

- macOS /tmp symlink plus repeated npm --prefix installs generated nonportable dependency paths. Discarded the generated install/lock and regenerated from the physical staging directory. Clean npm ci passed afterward.
- ESLint 10 with eslint-config-next's transitive plugin peers was not a compatible no-override baseline. Replaced it with @eslint/js, typescript-eslint and the direct Next plugin; no legacy/forced peer install required.
- Stable node-pg-migrate 9 dry-run initializes metadata. Separated true read-only status from migration planning and documented that side effect.
- QA initially reviewed during pending Playwright installation and flagged its missing declaration. Final manifest/lock declare the exact runner and the production smoke tests executed successfully.

## Limits and next step

No journal schema, roles/policies, auth/session flow, owner checks, idempotency receipts, real user data, migrations of business entities, Supabase configuration, cloud deployment or backup restoration is implemented/verified. These checks do not mark FS-01 through FS-13 passed.

Local database administrator credentials are synthetic tooling credentials, not the application's eventual runtime role. Hosted pool budgets, region/plan, TLS/cookie/identity behavior and role enforcement are future gates. React Hooks/accessibility lint rules are a follow-up before interactive feature UI; this foundation's direct lint composition does not imply those checks exist.

TASK-004 is next: implement actual SQL schema, distinct migration/runtime roles, owner-consistent references, constraints and meaningful isolated migration tests. Development setup is now repository-owned rather than dependent on old temporary document scripts.

Final repository-path confirmation: clean npm ci and the full lint/typecheck/unit/build/integration/smoke sequence passed again from the actual my_goals checkout after integration. The two project PostgreSQL containers were stopped afterward, preserving development data. Start them with npm run db:up for further database work. No code was committed or pushed as part of this task execution.
