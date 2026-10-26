# ADR-002 — Account and shared data across devices

Date: 2026-10-26.

Status: account/shared-data need accepted by the user through selection of the first option. The following technical design and online scope are proposals.

## Context and confirmed decision

The owner needs to consult and update the same journal from mobile and desktop with an account. Storage exclusive to one browser does not meet this need.

## Proposed design

Server with authoritative central storage, authentication, and owner isolation. Relational persistence is proposed to atomically save session, attendance, and history. The client fetches data on opening/refreshing views and regaining focus; version control handles conflicts. The first version requires connection; offline support and instant updates are outside the proposed scope.

## Consequences

Authorization, session expiration/sign-out, cross-device conflict, and backup requirements are added. A change is not confirmed until persisted on the server. Provider, engine, access method, costs, and deployment will be resolved in ADR-003. This decision does not authorize service purchases or public deployment.

Historical note: the session/attendance example above reflects the original context. ADR-004 and ADR-005 subsequently replace gym-specific assumptions with the general journal model.
