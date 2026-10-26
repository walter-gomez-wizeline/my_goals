# Project status — start here

Updated: 2026-10-26. Snapshot verified against implementation/specification commit `41b56e9`; this handoff-document update is subsequent work. Use `git log -1` and `git status --short` for current repository state, not this recorded hash as an always-current HEAD.

## Where we are

**Phase: specification/design complete for the first internal slice; application implementation not started.**

My Goals is a general-purpose Bullet Journal-inspired journal, initially a fast, polished portfolio/demo to attract clients. Capture tasks/events/notes first; goals and numeric tracking are optional later tools. Project/interface language is English; user content may use any language.

| Area | Current state |
| --- | --- |
| Product and architecture | Defined; Next.js/TypeScript + Vercel + Supabase PostgreSQL/Auth selected |
| First-flow behavior and contracts | Specified; QA document review found no blockers to tooling selection |
| Screens | Eight core screen types specified; first-flow low-fidelity desktop/mobile storyboard prepared |
| Execution plan | 14 tasks; TASK-001/002 have design artifacts; TASK-003 is next |
| Application/package/toolchain | Not created; runtime versions, package manager, driver and test/migration tooling remain to select |
| Cloud resources and deployment | Not provisioned by this work; no hosted application or verified cloud environment |
| Application/security/recovery tests | Not run; design review is not evidence of runtime correctness |

## Continue with TASK-003

**Objective:** select and verify compatible versions/tooling, then create the reproducible local development/test foundation when implementation is requested. Suggested owner: developer; architect reviews choices.

Minimum reading packet, in order:

1. [TASK-003 row and readiness/done rules](specs/15-first-flow-backlog.md).
2. [Selected stack, ADR-003](specs/decisions/ADR-003-cloud-stack.md).
3. [Technical contracts](specs/14-first-flow-technical-contracts.md), especially persistence roles, transactions and verification gates.
4. [First-flow scope](specs/13-first-flow-spec.md), only as needed to understand required behavior.

Deliverable: documented/verified tooling choices, reproducible setup, committed lockfile once packages exist, and actual baseline commands/checks. Preserve selected stack; do not begin all feature tasks or provision cloud resources merely because tooling is next. See [contribution workflow](CONTRIBUTING.md).

## Decisions not to rediscover

- Journal/collections first; no mandatory goal wizard. [ADR-005](specs/decisions/ADR-005-journal-first.md).
- One Next.js application with server-side use cases; Vercel + Supabase. No microservices/realtime/offline queue in the initial slice. [ADR-003](specs/decisions/ADR-003-cloud-stack.md).
- Invited isolated synthetic demo accounts, email/password, eight-hour revocable opaque application sessions; no public signup. [ADR-006](specs/decisions/ADR-006-first-flow-contracts.md).
- Reopen task → Pending; In progress starts explicitly in a later extension. Same ADR supersedes older reopen-to-in-progress text.
- First internal slice: sign in → daily capture → collection search/linking → complete/reopen → second-device refresh. It is **not the complete core demo**. Migration, Month/Future, Review and portability remain subsequent work.

## Open items and gates

- TASK-003: package/runtime versions, database driver, migration/test tools; verify against current primary documentation.
- TASK-004/005: implement and test constraints, transaction locks, owner isolation, rate limits, CSRF and sessions.
- Before external demo access: verify provisioning/password recovery and secure credential handoff, provider configuration and synthetic account isolation.
- Before hosted provisioning: concrete budget, region, plans, credentials and deployment authorization. Approximate prior pricing illustrations are not approved spend.
- Before production-ready claims: measured backup/identity restore under RNF-07/AC-75, not just configured backups.

These do not block reading/planning or local tooling selection. No current code failure is diagnosed because application code does not exist yet.

## Existing evidence

Documentation links and stable IDs checked; wireframe layouts inspected in browser at desktop/mobile widths; Mermaid syntax parsed. QA reviewed specification consistency. Temporary validation scripts were outside the repository, so their original paths are not reproducible project commands. Recreate checks or add maintained tooling rather than depending on those temporary files.

## How to keep this useful

After each meaningful delivery, update phase, completed work/evidence, next task, open gates and this snapshot date in the same change as the backlog. Keep this file brief; detailed behavior belongs in linked specs. Focus maintains the consolidated handoff; planner reconciles task state with evidence. Human contributors follow the same rule. Git history and task evidence determine what actually happened; chat memory is not required.
