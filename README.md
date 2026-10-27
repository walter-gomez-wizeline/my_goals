# My Goals

A digital journal based on Bullet Journal for capturing, organizing, and reviewing tasks, events, notes, and personal records; it helps you observe progress and work toward goals when needed.

## Start here

1. Read [PROJECT_STATUS.md](PROJECT_STATUS.md) for the current phase, decisions, next task and open gates.
2. Follow [CONTRIBUTING.md](CONTRIBUTING.md) for targeted reading, setup reality and the SDD contribution workflow.
3. Pick the next ready task in the [execution backlog](specs/15-first-flow-backlog.md) and read only its linked contracts/criteria.

Current milestone: TASK-003 local foundation implemented and verified; journal/authentication features remain unimplemented. Next: TASK-004, application schema and migrations. Selected approach: Next.js/TypeScript, Vercel and Supabase PostgreSQL/Auth. The status file is the maintained handoff; git history identifies the current revision.

## Branch workflow

Use feature branches from dev for every change. Integrate authorized features into dev; promote to prod only after separate validation and authorization. Legacy main is retained unchanged. See [CONTRIBUTING.md](CONTRIBUTING.md) for the GitFlow-style workflow.

## Run locally

See [CONTRIBUTING.md](CONTRIBUTING.md) for Node/npm prerequisites, environment examples, Docker services and verification. After setup, `npm run dev` serves the foundation at http://127.0.0.1:3000. No cloud credentials are required.

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

- [Cloud architecture options](specs/07-cloud-architecture-options.md)
- [Selected cloud stack decision](specs/decisions/ADR-003-cloud-stack.md)
- [Three-agent architecture review](specs/08-cloud-review.md)
- [Architecture vote and demo approach](specs/09-architecture-vote.md)
- [MVP screens and interactions](specs/10-mvp-screens.md)
- [Architecture diagrams (Mermaid)](specs/11-architecture-diagrams.md)
- [Project walkthrough diagrams, step by step](specs/12-project-walkthrough-diagrams.md)
- [First-flow specification](specs/13-first-flow-spec.md)
- [First-flow technical contracts](specs/14-first-flow-technical-contracts.md)
- [First-flow execution backlog](specs/15-first-flow-backlog.md)
- [Wireframe storyboard](specs/wireframes/first-flow.html)
- [First-flow access and lifecycle decision](specs/decisions/ADR-006-first-flow-contracts.md)
- [Local tooling decision](specs/decisions/ADR-007-local-toolchain.md)
- [TASK-003 verification](docs/task-003-verification.md)

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

## Specialist agents

**Focus** (`focus`) is the lead orchestrator: it chooses when to involve `qa`, `developer`, `architect`, `uiux`, and `planner`, coordinates their work, and consolidates results. The primary agent follows this role through AGENTS.md; a reusable named Focus definition is also included. The UI/UX agent owns screen and user-experience specifications, responsive interactions, interface copy, visual consistency, and accessibility. See [project coordination rules](AGENTS.md) and [agent usage](.codex/agents/README.md). Definitions are written in English and inherit session model and permissions.

The `planner` specialist is a Technical Project Manager responsible for a lightweight execution plan, traceable tasks, dependencies, priorities and qualified estimates. Focus retains orchestration and actual task assignment.
