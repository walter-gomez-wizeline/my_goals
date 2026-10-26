# Delivery and validation — v0.6

## Status

Specifications center on journal and collections. No application has been implemented and no software tests have run. Responsive web and shared account data are confirmed; provider and stack remain undecided. Documentation and interface language: English.

## Increments

| Increment | Verifiable delivery | Traceability |
| --- | --- | --- |
| I-00 | Consolidate journal journey, select stack/provider, record ADR-003 | ADR-001, ADR-002, ADR-005 |
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

Formula, unit, and source changes require explicit revision and historical treatment. There is currently no production data to migrate.
