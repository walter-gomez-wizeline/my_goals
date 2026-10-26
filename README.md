# My Goals

A digital journal based on Bullet Journal for capturing, organizing, and reviewing tasks, events, notes, and personal records; it helps you observe progress and work toward goals when needed.

Status: specification v0.6. Core: index, future/monthly/daily logs, collections, rapid logging, reflection, and intentional migration. Goals, subtasks, structured records, and indicators are optional capabilities. Confirmed: responsive web application and an account with shared data across devices. No application has been implemented and no stack has been selected.

## Documentation

- [Step-by-step walkthrough](specs/06-bullet-journal-flow.md)
- [Vision and scope](specs/00-vision.md)
- [Requirements and acceptance criteria](specs/01-requirements.md)
- [Domain and calculations](specs/02-domain.md)
- [Proposed architecture](specs/03-architecture.md)
- [Delivery and validation plan](specs/04-delivery.md)
- [Platform decision](specs/decisions/ADR-001-platform.md)
- [Account and shared persistence](specs/decisions/ADR-002-persistence.md)
- [General tracking model](specs/decisions/ADR-004-goal-tracking.md)
- [Journal and collections as the core](specs/decisions/ADR-005-journal-first.md)
- [Acceptance examples](specs/05-examples.md)

## SDD workflow

1. Discover needs and document real examples.
2. Specify behavior, rules, and invariants with stable identifiers.
3. Resolve questions affecting scope, persistence, and experience.
4. Agree on a specification version and record architecture decisions.
5. Derive small tasks and traceable acceptance tests.
6. Implement complete flows and check each delivery against its criteria.
7. Update the specification first when expected behavior changes.

These documents are a revisable proposal. Silence does not approve a decision. Implementation begins once the decisions needed for the first flow have been resolved.

English is the language for project documentation, identifiers introduced in future code, and application interface copy. User-authored content may use any language; the application must not translate it automatically. Existing requirement IDs remain unchanged for traceability.
