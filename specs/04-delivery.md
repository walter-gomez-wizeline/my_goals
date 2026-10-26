# Delivery and validation — v0.12

## Status

Specifications center on journal and collections. No application has been implemented and no software tests have run. Responsive web and shared account data are confirmed; cloud application/database required; Next.js/TypeScript, Vercel and Supabase PostgreSQL/Auth selected; budget, region and operational details remain open. Documentation and interface language: English.

## Increments

| Increment | Verifiable delivery | Traceability |
| --- | --- | --- |
| I-00 | Three-agent stack vote completed; next specify first demo flow, identity/persistence contracts, budget and region | ADR-001, ADR-002, ADR-005 |
| I-01 | Account, journal, persisted task/event/note capture without goals | RF-02, RF-10, RF-11; AC-51, AC-61 |
| I-02 | Index, search, collections, links without copies; key/signifiers | RF-04, RF-13, RF-15 |
| I-03 | Future/monthly logs, free reflection, intentional migration | RF-05, qualitative RF-06, RF-14, RF-16 |
| I-04 | Core export/restore, accessibility, journey validation | RF-07, RNF-01 through RNF-07; steps 1–8 |
| I-05 | Optional goals, subtasks, in-progress state | RF-01, RF-08 |
| I-06 | Structured records, indicators, charts; weight/course cases | RF-03, RF-09, RF-12; step 9 and E-01 through E-04 |

The first functional delivery of the method comprises I-01 through I-04. Authentication, integrity, and isolation are not deferred to extensions. Export/restore expands with new entities. Typed fields and indicators are not journal prerequisites. RF-17 applies across all increments.

## Verification

- Core: capture from a new account without a goal; search; link to multiple collections; open the same identity from daily/monthly logs; retain extended notes.
- Method: consistent key, completion versus discard, linked migration marks, month without day, visible earlier pending items, no automatic moves.
- Review: save reflection without pending items or percentages; keep tasks; resume decisions; close pending-item review only with explicit decisions.
- Persistence: owner authorization, transactions, idempotency, cross-device conflicts, corrections, atomic import.
- Extensions: sum versus latest observation, zero versus absence, directional percentages, milestone denominators, definition revisions, incompatible units.
- Interface: keyboard and 360/1280 px flows; quick daily-log/index access; recoverable errors; English copy and accessible labels; unchanged user content in other languages.
- Operations: session expiration/sign-out, backups, isolated restoration before production.

## Definition of done

Requirements traced to verified criteria; persistence after restart; isolation; retained history and links; updated documentation. Specifications distinguish confirmed directions from proposals. Document review is not represented as application testing.

## History

| Date | Version | Change |
| --- | --- | --- |
| 2026-10-26 | 0.1 | Initial vision and Bullet Journal adaptation |
| 2026-10-26 | 0.2 | Gym example, subtasks, states |
| 2026-10-26 | 0.3 | Account and shared data |
| 2026-10-26 | 0.4 | General model, typed records, indicators |
| 2026-10-26 | 0.5 | Journal/collections core, walkthrough, optional extensions |
| 2026-10-26 | 0.6 | English documentation and default interface language; stable requirement IDs; unchanged user-authored content |
| 2026-10-26 | 0.7 | Three-agent cloud comparison, proposed ADR-003, privacy clarification, session/transaction verification criteria |

Formula, unit, and source changes require explicit revision and historical treatment. There is currently no production data to migrate.


I-00 decision sequence (audience and approach now resolved; budget still open): (1) audience/budget, (2) logical design, (3) candidate shortlist and cost model, (4) explicit stack decision, (5) identity/persistence contracts, (6) operational design. RF-18 and AC-71 through AC-75 expand cloud verification; the CV checklist in the options document maps further integration checks. None has been executed against a deployed application.


Version 0.8, 2026-10-26: architect, developer and qa independently voted A (3/3). The rapid client-acquisition demo is the initial delivery objective. Optional goals/structured tracking remain later increments; the base method scope is retained. Next specify the first slice, not the entire optional extension engine. See 09-architecture-vote.md.


## Screen-design step — v0.12

Focus consolidated independent UI/UX and QA inventory reviews into [eight proposed screen types](10-mvp-screens.md), with four main navigation destinations and shared contextual editors. Define low-fidelity Daily/Collection wireframes next, followed by Planning/Review and sign-in/access details. These are design proposals, not implemented screens or user-validated usability results. The first slice and full core delivery remain distinct; existing acceptance IDs and optional-extension ordering are unchanged.


## First-flow execution baseline — v0.12

Specs/design/planning completed as documents: [functional flow](13-first-flow-spec.md), [technical contracts](14-first-flow-technical-contracts.md), [storyboard](wireframes/first-flow.html), [backlog](15-first-flow-backlog.md), ADR-006. No application implementation has started. The 14-task plan is the execution source for the initial internal slice; the high-level increments above remain the full roadmap.

Initial slice: invited sign-in → daily capture → collection search/linking → task completion/reopening → cross-device refresh. Core reopening returns Pending; In progress remains later. Intentional migration, Month/Future, Review and portability are subsequent core work, not silently removed. Next assignment is TASK-003 when implementation is requested. No deployment/purchase is authorized by specification completion.
