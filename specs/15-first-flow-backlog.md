# First-flow execution backlog — v0.12

Date: 2026-10-26. Focus consolidated planner's read-only proposal using [functional specification](13-first-flow-spec.md), [technical contracts](14-first-flow-technical-contracts.md), [wireframes](wireframes/first-flow.html) and ADR-006. No application task is implemented or tested. The user authorized specification/design/planning in this turn, not deployment or purchase.

## Status and estimates

Ready = sufficiently specified for assignment once implementation is requested. Waiting = depends on unfinished work. Design complete = document artifact exists and its relevant review is recorded; it is not executed software. Owner means suggested specialist; Focus controls actual assignments.

Effort ranges: S narrow, M moderate, L substantial. All implementation estimates are low-confidence planning estimates until developer reviews tooling and code; no calendar dates or story-point/hour conversion. Planner consulted current repository/specifications; it did not claim developer-estimation agreement.

## Tasks

| ID | Outcome and deliverable | Suggested owner | Dependencies | Effort | Status | Verification/evidence required |
| --- | --- | --- | --- | --- | --- | --- |
| TASK-001 | Reconcile access/state/scope contracts across domain, screens, requirements and diagrams | architect / Focus | None | S–M | Design complete (QA consistency review recorded) | ADR-006 and specs 13/14; core reopen Pending, invitation/session policies, explicit internal-slice boundary; QA document review |
| TASK-002 | Annotated Daily/Collection desktop/mobile storyboard, supporting Sign-in/Index and recovery states | uiux / Focus | 001 | M | Design artifact complete; actual usability not validated | HTML storyboard and FS-01–13 mapping; document/visual inspection; AC-05/06/13/40/46–51/55–58/61/69 |
| TASK-003 | Verify compatible runtime/framework versions, driver, SQL migrations, package/test tooling and local setup | developer; architect review | 001 | M | Ready for implementation-phase assignment | Document selected tools/versions with primary sources; reproducible setup, lockfile and real baseline checks; ADR-003, RNF-01/03/06 |
| TASK-004 | Minimal schema/migrations and synthetic fixtures, owner constraints, audit/receipt integrity and ordering | developer | 001,003 | L | Waiting | Fresh PostgreSQL migration, constraints, rollback and pooled-owner isolation tests; AC-45/51/57/72/73 |
| TASK-005 | Invited email/password access, rate limiter, eight-hour sessions, CSRF, local-session logout and operator recovery | developer; architect review | 002,004 | L | Waiting | Invalid/uninvited rejection, expiry, account disable, session replay denial, independent devices, safe reset and no token leakage; AC-44/49/50/73/74 |
| TASK-006 | Authenticated responsive shell and date-addressable Daily with loading/empty/failure/earlier-pending states | developer | 002,003,005 | M | Waiting | 360/1280 px and keyboard flow, historical dates, safe redirects, no goal/setup gate; AC-14/40/51/61/68/69 |
| TASK-007 | Persisted task/event/note capture, content/date editing, history, signifiers/archive and shared editor | developer | 004,006 | L | Waiting | Blank/size validation, committed IDs, audit/receipt atomicity, original-key replay, saved feedback and stale-edit rejection; AC-05–07/46/47/61/64/70–72 |
| TASK-008 | Collections index/create/edit/archive/restore and owned title/text search, including uncollected entries | developer | 004,006,007 | M–L | Waiting | Original-entry results, empty/no-results/failure distinction, no cross-account leakage, preserved archived data; AC-45/55/56/58 |
| TASK-009 | Collection detail, add/link/unlink originals and accessible independent daily/collection ordering | developer | 007,008 | M–L | Waiting | Multiple memberships, duplicate no-op, original retained on unlink, order versions/conflicts and owner references; AC-13/45/46/56/57/61/72 |
| TASK-010 | Task complete/discard/reopen Pending, preserving history and excluding event/note transitions | developer | 001,007 | M | Waiting | Allowed/invalid transitions, completion timestamp cleared on reopen, state/history/receipt atomicity; AC-06/72; ADR-006 |
| TASK-011 | Integrate two-device refresh, recovery, conflicts, expiry and account-cache/draft cleanup | developer; uiux review | 005,007,009,010 | M–L | Waiting | FS-08–12, explicit conflict reapply, same-account draft recovery, no stale identity disclosure; AC-43/46–50/74 |
| TASK-012 | Independently verify stable slice and prepare repeatable synthetic demonstration script | qa | 008,009,010,011 | L | Waiting | FS-01–13 results, two accounts/devices, lost/concurrent requests, pool reuse, database failures, accessibility, defects/rechecks |
| TASK-013 | Qualify concrete hosted configuration/runbook: budget, region, plans, identity/email access, secrets and deployment migrations | architect + developer / Focus | 003; provisioning requires authorization | M–L | Design decisions available; execution waiting | Reviewed configuration, environment separation and credential handoff; actual infrastructure checks only when authorized; AC-44/73/74, RNF-04/06 |
| TASK-014 | Verify authorized hosted release and recovery readiness, distinguishing partial slice from complete-core demo | qa + developer | 012,013; authorized environment | M–L | Waiting | Hosted smoke evidence and explicit recovery status; execute isolated backup/identity restoration before production-ready claims; AC-71/74/75, RNF-07 |

TASK-007/008/009 group closely related behaviors for a small MVP; split them into bounded file-owned assignments when implementation starts if actual effort exceeds one coherent review unit. Do not skip archive/signifier/order behavior merely because it is less visible in the happy path.

## Dependency order

Critical path hypothesis: 001 → 003 → 004 → 005 → 006 → 007 → 008 → 009 → 011 → 012 → 014. Task 002 must be ready before 005/006; task 013 can become a separate release blocker. Task 010 may run alongside collection work only with nonoverlapping ownership. Estimates/critical path are hypotheses, not measured delivery forecasts.

Next actionable task: TASK-003 when application implementation/setup is requested. It resolves driver/migration/test tooling and validates the technical baseline before building the first account flow. No cloud account creation is a prerequisite to writing local specifications.

## Definition of ready

Task has stable scope, referenced criteria, resolved prerequisites, explicit allowed files/owner, available isolated test data/environment and verification method. Material unknowns become decision tasks, not hidden assumptions. Ready does not mean code has been written or execution automatically authorized.

## Definition of done

Deliverable exists, applicable criteria have actual evidence, defects are resolved or explicitly accepted, dependent documents are current, no unrelated scope changed, and Focus consolidates the result. Document checks cannot mark application behavior passed. Record command outputs and coverage limits, not merely “tests pass.”

## Subsequent increments retained

- Explicit migration with history and Monthly/Future planning.
- Reflection, resumable pending-item review and month transition decisions.
- Settings/data export/restore, full-core accessibility and operational qualification.
- Optional goals, In progress/subtasks, typed records and indicators after the core.

The internal first slice does not replace these commitments or become the complete Bullet Journal demo by renaming it MVP. The planner role owns plan maintenance; Focus remains orchestrator.

QA’s final read-only pass found no remaining specification blockers for TASK-003. Actual database, authentication, security and hosted behavior remain untested until implementation.
