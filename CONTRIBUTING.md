# Contributing

## Start with a bounded reading packet

Read [PROJECT_STATUS.md](PROJECT_STATUS.md), select one ready task in the [backlog](specs/15-first-flow-backlog.md), and read the specs/ADRs relevant to it. You do not need the entire repository or chat history. Agents additionally follow [AGENTS.md](AGENTS.md); humans do not need Codex or custom agents to contribute.

| Work | Targeted context |
| --- | --- |
| Toolchain/local setup, TASK-003 | Status, backlog row, ADR-003, technical contracts |
| Persistence/schema, TASK-004 | Technical contracts, domain, ADR-006; referenced AC criteria |
| Authentication, TASK-005 | ADR-006, technical contracts section 1, FS-01/11/12 and relevant AC criteria |
| Screens and capture, TASK-006/007 | First-flow spec, screen spec sections for the assigned screen, storyboard, relevant endpoint contracts |
| Collections/task state, TASK-008–010 | First-flow scenarios, technical contracts, ADR-006 for state; only relevant domain sections |
| Integration/QA, TASK-011/012 | Assigned FS scenarios and AC criteria, technical contracts and current implementation diff |
| Hosting/recovery, TASK-013/014 | ADR-003, cloud verification checklist, technical operational gates, RNF-07/AC-75 |

Expand reading only if a reference or contradiction requires it. The [README](README.md) is the full index, not mandatory sequential reading.

## Local setup

Prerequisites: Node 24.18.0 (`nvm use` reads .nvmrc), npm 11.16.0 and Docker Compose for database checks. Exact direct dependencies and the lockfile are committed together. Run commands from the repository root, not with a symlinked npm --prefix path. No hosted credentials are required for this foundation.

```sh
nvm install
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open http://127.0.0.1:3000. The page deliberately says Development foundation; authentication, journal features and cloud services are not implemented. Stop the dev server with Ctrl-C. Copy .env.example only when .env.local does not already exist; never overwrite another contributor's configuration. .env.local is ignored by git.

Environment variables (sample values are loopback-only synthetic Docker credentials):

| Name | Purpose |
| --- | --- |
| DATABASE_URL | Development connection for the local connectivity check |
| MIGRATION_DATABASE_URL | Separate local migration connection; TASK-004 establishes distinct roles |
| TEST_DATABASE_URL | Explicit isolated my_goals_test connection; never the development or hosted database |
| DATABASE_POOL_MAX | Development-check pool size, default 3, valid range 1–10; hosted connection budget remains open |
| PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH | Optional already-installed Chromium/Chrome executable for smoke tests; normally install Playwright Chromium instead |

### Database startup and migrations

```sh
npm run db:up
npm run db:check
npm run db:migrate:status
npm run db:migrate:plan
npm run test:integration
npm run db:stop
```

Compose starts PostgreSQL 17 on loopback ports 55432 (persistent development database) and 55433 (tmpfs disposable test database). Stop affects only this Compose project; development data remains in its named volume, while test data is disposable. No volume-deletion/reset command is supplied. Ports must be available. Pin the image digest from compose.yaml; do not substitute an unreviewed latest major.

`db:migrate:status` is a read-only metadata/source-file check. `db:migrate:plan` previews pending SQL; node-pg-migrate 9 may create its bookkeeping table even for a dry run. `npm run db:migrate` applies pending local migrations. Currently there are no business migration files (TASK-004 is next), so an empty migration list is expected. No command automatically migrates during an HTTP request.

The development container's administrator credentials are for foundation checks only. Runtime least-privilege roles, application schema and hosted policies are not implemented. Guarded CLI commands reject nonlocal hosts, wrong database names and URL query overrides. Generic local PostgreSQL does not validate Supabase Auth, Data API isolation or hosted role policies.

### Verification commands

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:integration
npx playwright install chromium
npm run test:smoke
```

`npm run check` combines lint, Next type generation/TypeScript, unit tests and production build. Integration tests require the running isolated test database and either TEST_DATABASE_URL or .env.local. They fail rather than skip when unavailable. Smoke tests require a prior build, start their own production server on 127.0.0.1:3100 and stop it afterward. They verify only the honest foundation page at desktop/mobile widths, not FS-01–FS-13. An optional explicit executable override avoids downloading a browser when suitable Chrome is already installed.

`npm start` runs an existing production build on 127.0.0.1:3000; it does not build or deploy. Unit and browser checks do not require a cloud account. No live identity credentials belong in this setup. GitHub Actions has the same foundation/unit/database/browser checks configured; a workflow file is not evidence that CI has run remotely.

Open [the storyboard](specs/wireframes/first-flow.html) in a browser for planned screens; it remains a static design artifact. Read [ADR-007](specs/decisions/ADR-007-local-toolchain.md) for tooling rationale and [verification evidence](docs/task-003-verification.md) for this delivery.

## Spec-driven workflow

1. Choose a ready task and identify intended outcome, dependencies, allowed files and relevant RF/RNF/AC/FS/ADR references. If someone is already working on shared files, coordinate before editing.
2. Distinguish confirmed choices, design baseline and remaining proposals. User direction takes precedence. For a behavior change, update affected specs/criteria and add/update an ADR if consequential **before** implementing the new behavior.
3. Work in a focused branch when using a shared repository. No branch naming convention is currently required. Preserve unrelated local changes; do not reset another contributor's work.
4. Deliver the smallest coherent flow or decision. Keep journal capture usable without optional tracking. Do not silently drop errors, history, authorization or accessibility to accelerate the demo.
5. Run checks appropriate to the change and record exact commands, environment and outcomes. For code, use the established tooling once available; add meaningful regression checks. Mark unavailable/unexecuted checks honestly.
6. Update the backlog row with evidence, dependencies and state. Update PROJECT_STATUS.md with the next ready task and open gates. Update setup instructions when tooling changes.
7. Review the diff, stage intended files and create an English commit explaining the change. Push/PR workflow depends on the repository's actual remote setup; no remote or CI gate is assumed here.

## Validation by change type

- Documentation: verify local links, referenced IDs, terminology, scope and cross-document consistency; parse changed Mermaid blocks with a real parser. Record the parser/version. Visual review is separate from syntax validation.
- Wireframes: inspect mobile/desktop layouts and state coverage; distinguish a static prototype from working UI or a usability study.
- Code (when present): verify relevant acceptance scenarios and unit/integration behavior. Persistence tests require real isolated PostgreSQL; local SQL tests alone do not prove hosted identity configuration.
- Authentication/security: test two accounts and distinct device sessions, known foreign IDs, replay, expiry/revocation, private-cache/draft cleanup, owner context reuse and CSRF when applicable.
- Operations: validate environment separation and migrations; exercise restore before making recovery claims. User export/import is not an operational backup.

## Completion and handoff

A task is done only when its applicable deliverable and verification evidence exist. “Specified,” “implemented” and “verified” are different states. TASK-001/002 design completion does not mark any runtime behavior passed. Blocked tasks name the actual missing decision/dependency rather than a vague lack of context.

Use this brief structure in a task note or PR description (no new permanent handoff file per task is required):

```text
Task: TASK-...
Outcome and scope:
Changed files:
Requirements/criteria covered:
Checks executed and results:
Not tested / limitations:
Decisions or remaining gates:
Next ready task and minimum reading packet:
```

Update status/backlog in the same change. In PROJECT_STATUS.md, label a commit hash as the last verified baseline rather than attempting a self-referential current-commit hash. Dates use the project's client timezone when relevant; git is authoritative for current revision and dirty state.

## Collaboration and boundaries

Focus coordinates scope, specialist choice and final integration. Planner maintains task/dependency/status accuracy. UI/UX, architect, developer and QA provide their own specialty; creating agents is not necessary for human development. Avoid competing backlogs or parallel edits to shared specs without an owner.

Project documentation, identifiers and interface copy are English. User content is not automatically translated. Use synthetic fixtures only; never commit credentials, session secrets, provider tokens, personal journal content or environment secrets. Local/test and hosted-demo identities/data must stay separate. Purchases, provisioning, deployment and production-data mutations require their own authorization; a ready task is not that authorization.
