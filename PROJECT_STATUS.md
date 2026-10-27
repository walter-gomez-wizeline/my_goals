# Project status — start here

Updated: 2026-10-26. Last verified implementation baseline: `bbf0a75` (TASK-003). The workflow-policy feature is being integrated into dev under explicit user authorization; prod retains that baseline. Use `git log -1` and `git status --short` for current repository state, not this recorded hash as an always-current HEAD.

## Where we are

**Phase: TASK-003 local foundation implemented and verified; TASK-004 persistence schema is next.**

My Goals is a general-purpose Bullet Journal-inspired journal, initially a fast, polished portfolio/demo to attract clients. Capture tasks/events/notes first; goals and numeric tracking are optional later tools. Project/interface language is English; user content may use any language.

| Area | Current state |
| --- | --- |
| Product and architecture | Defined; Next.js/TypeScript + Vercel + Supabase PostgreSQL/Auth selected |
| First-flow behavior and contracts | Specified; QA document review found no blockers to tooling selection |
| Screens | Eight core screen types specified; first-flow low-fidelity desktop/mobile storyboard prepared |
| Execution plan | 14 tasks; TASK-001/002 have design artifacts; TASK-003 complete; TASK-004 is next |
| Application/package/toolchain | Local Next.js foundation, pinned npm lockfile, pg, SQL migration runner, unit/integration/browser checks; no product features yet |
| Cloud resources and deployment | Not provisioned by this work; no hosted application or verified cloud environment |
| Checks | Foundation lint/types/build, 13 unit checks, 2 real-PG transaction tests, desktop/mobile smoke; business/auth/security/recovery not yet verified |

## Required Git workflow

Use dev for development integration, prod for production-targeted changes, and feature/<description> for every authored change. Start new features from the verified dev baseline; never edit directly on dev/prod or legacy main. Authorized feature merges use dev; production promotion is a separate validated/authorized action.

Branch setup: dev and prod start from main at bbf0a75. The workflow-policy feature is integrated into dev only; main/prod are unchanged by that feature. No remote push/default-branch change/deployment is part of this operation. Confirm actual branch and history with git before continuing. Next implementation work starts on a new feature/task-004-persistence-schema branch from dev.

## Continue with TASK-004

**Objective:** implement minimal application schema/migrations, synthetic fixtures, owner-consistent references, ordering/version constraints and audit/command storage. Suggested owner: developer; architect and QA review the relevant contracts/evidence.

Minimum reading packet:

1. [TASK-004 and dependency/done rules](specs/15-first-flow-backlog.md).
2. [First-flow technical contracts](specs/14-first-flow-technical-contracts.md), sections 2–4.
3. [ADR-006 access/lifecycle](specs/decisions/ADR-006-first-flow-contracts.md) and [ADR-007 tooling](specs/decisions/ADR-007-local-toolchain.md).
4. Existing src/infrastructure/db, scripts, migrations/README.md and integration tests; read broader domain sections only as needed.

Start with [CONTRIBUTING.md](CONTRIBUTING.md) for verified setup commands. Deliver a fresh isolated PostgreSQL migration and constraint/rollback tests, with distinct runtime/migration roles. Do not implement authentication or provision cloud resources merely because schema work is next.

## Decisions not to rediscover

- Journal/collections first; no mandatory goal wizard. [ADR-005](specs/decisions/ADR-005-journal-first.md).
- One Next.js application with server-side use cases; Vercel + Supabase. No microservices/realtime/offline queue in the initial slice. [ADR-003](specs/decisions/ADR-003-cloud-stack.md).
- Invited isolated synthetic demo accounts, email/password, eight-hour revocable opaque application sessions; no public signup. [ADR-006](specs/decisions/ADR-006-first-flow-contracts.md).
- Reopen task → Pending; In progress starts explicitly in a later extension. Same ADR supersedes older reopen-to-in-progress text.
- First internal slice: sign in → daily capture → collection search/linking → complete/reopen → second-device refresh. It is **not the complete core demo**. Migration, Month/Future, Review and portability remain subsequent work.

## Open items and gates

- TASK-004: actual schema, least-privilege roles, composite ownership constraints and meaningful migration/fixture tests.
- TASK-005: provider identity, opaque sessions, rate limits, CSRF and account-recovery behavior remain to implement.
- Before external demo access: verify provisioning/password recovery and secure credential handoff, provider configuration and synthetic account isolation.
- Before hosted provisioning: concrete budget, region, plans, credentials and deployment authorization. Approximate prior pricing illustrations are not approved spend.
- Before production-ready claims: measured backup/identity restore under RNF-07/AC-75, not just configured backups.

These do not block reading/planning or local tooling selection. The current foundation boots without cloud credentials; no journal/account feature is represented as implemented.

## Existing evidence

See [TASK-003 verification](docs/task-003-verification.md) for actual commands/results and limits. The maintained scripts/tests and lockfile now live in the repository; earlier temporary document checks are not required setup. PostgreSQL checks ran on isolated 17.11 containers; browser smoke used explicit installed Chrome. GitHub Actions is configured but has not been executed remotely. No business acceptance/security/restore test has passed by implication.

## How to keep this useful

After each meaningful delivery, update phase, completed work/evidence, next task, open gates and this snapshot date in the same change as the backlog. Keep this file brief; detailed behavior belongs in linked specs. Focus maintains the consolidated handoff; planner reconciles task state with evidence. Human contributors follow the same rule. Git history and task evidence determine what actually happened; chat memory is not required.
