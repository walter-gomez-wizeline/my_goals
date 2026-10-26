# ADR-006 — First-flow access and task lifecycle

Date: 2026-10-26. Status: selected design baseline by Focus under the user's instruction to define the first flow. Reversible product details may be refined; no purchase, provisioning or deployment is authorized by this document.

## Context

The first internal slice must demonstrate sign-in, free journal capture, collections and durable cross-device state. Sign-in method and visitor access were unspecified. The full domain reopened tasks into In progress, while the core screens deferred that extension.

## Decisions

1. Initial demo access is operator-invited, with one isolated account/journal per person and synthetic content only. No shared writable journal or public signup.
2. Use email/password with Supabase Auth through the server. A verified provider identity must map to an active, explicitly provisioned internal account; successful provider authentication alone never creates a journal account.
3. Use an opaque revocable application session, checked on every private request. Provider tokens are not the application's browser session and cannot silently recreate it after sign-out.
4. Default application session lifetime: eight hours absolute, no sliding refresh or remember-me. Cookie: `__Host-my_goals_session`, Secure, HttpOnly, SameSite=Lax, Path=/, no Domain. Store only a SHA-256 hash of at least 32 random bytes of session secret. Local development must use HTTPS or a clearly local-only cookie configuration that is never deployable to the hosted environment.
5. Core reopening returns completed/discarded tasks to Pending and clears their current completion timestamp; retain previous transitions in history. Later StartTask (or subtask activity) explicitly starts In progress. This replaces the older reopen-to-in-progress statement rather than inventing a new state in the initial UI.
6. Preserve the chosen stack. Do not add queues, realtime synchronization, public registration, generic tracking configuration or optional subtask UI to this slice.

## Operational access procedure (specified, not performed)

An authorized operator creates the provider identity using provider administration, creates the internal Account/ExternalIdentity/Journal mapping and verifies a unique active identity. Provisioning retries reconcile existing identities rather than creating duplicates. Compensate or disable an orphaned provider identity if application mapping fails; never auto-grant access to unmapped identities.

Share per-user credentials only through an approved private channel outside committed fixtures; no credentials appear in specs, source, screenshots or logs. Before external use, verify the selected provider's initial-password/reset mechanism and a secure credential handoff. Sign-in copy directs invitees to the demo host for access/reset; no nonfunctional recovery link.

For operator-assisted password recovery or account disable: block/revoke application access first, revoke all application sessions for that account, perform the provider-side recovery/revocation step, then reactivate only after identity ownership is confirmed. Password changes outside this controlled procedure are not offered in the first slice. Recheck eligibility on every private request. This does not claim provider password changes automatically revoke independent application sessions.

## Consequences

Invitation reduces UI scope but adds an operator readiness gate. Opaque sessions require a database lookup and CSRF protection. Core reopen-to-pending needs coordinated domain, screen, requirement and diagram changes. No historical production data exists to migrate.

Detailed contracts: [first-flow specification](../13-first-flow-spec.md), [technical contracts](../14-first-flow-technical-contracts.md), [wireframe storyboard](../wireframes/first-flow.html).
