# ADR-003 — Cloud application and database stack

Date: 2026-10-26. Status: selected through the user-delegated three-agent vote; not provisioned.

## Context

Responsive cloud application, shared account data, and journal-first experience are confirmed. The user prioritizes rapid MVP delivery for a portfolio/demo intended to attract clients, and explicitly asked architect, developer and qa to vote on the best approach.

## Alternatives and result

- A: Next.js/TypeScript on Vercel + Supabase PostgreSQL/Auth — 3 votes.
- B: container application on Render + managed PostgreSQL + identity provider to select — 0 votes.
- C: AWS ECS/Fargate + RDS PostgreSQL + Cognito — 0 votes.

See [independent ballots and rationale](../09-architecture-vote.md) and the [original options comparison](../07-cloud-architecture-options.md).

## Decision

Select A: one TypeScript/Next.js application, Vercel hosting, Supabase PostgreSQL and Supabase Auth. Keep authenticated use cases on the server, preserve modular domain boundaries, and use explicit SQL transactions for mutations/history/idempotency. The browser never receives database credentials. Avoid separate backend services, queues and realtime infrastructure for the initial demo.

## Rationale and consequences

This minimizes infrastructure and identity integration work so effort can focus on the journal experience and demonstrable acceptance behavior. B remains viable but adds an identity integration; C adds operations work that does not sufficiently improve the first demo. These are engineering assessments, not measured development-time guarantees.

Two providers and provider-aware adapters are accepted tradeoffs of the selected approach. Ownership checks, revocable application sessions, transaction boundaries, pooling and recovery still require specification and verification.

Plan for Vercel Pro and Supabase Pro when hosting the commercial demo; budget is not approved by this decision. No purchases or deployment were performed. Region, identity UX, session details, database driver/migration tooling, exact versions and environment sizing remain open.

## Next step

Specify screens, access and persistence contracts for the first journal slice before implementation. Preserve existing requirements, including qualitative review and migration; defer optional tracking rather than specializing the core for a sample use case.
