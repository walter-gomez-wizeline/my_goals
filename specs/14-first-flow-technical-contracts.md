# First-flow technical contracts — v0.12

Date: 2026-10-26. Status: design baseline for [first flow](13-first-flow-spec.md), not executable schema or an implemented API. Next.js/TypeScript, Vercel and Supabase PostgreSQL/Auth remain selected. Driver, migration tool and exact package versions must be verified/chosen in the first foundation task.

## 1. Identity and application sessions

Server handles credentials using Supabase Auth, verifies provider/subject and requires a pre-provisioned active Account mapping. Do not use email as ownership key; do not auto-provision on successful authentication. Disable public signup in the provider configuration as well as the interface. No provider tokens in browser storage or business-command receipts. Do not silently establish a new application session from an old provider token after logout.

Use ADR-006's opaque cookie and hashed secret. Every private read/write checks session existence, expiry, revocation and account eligibility. Failed dependency verification fails closed. Eight-hour absolute lifetime, no sliding refresh. Revocation is local to the current session; operator recovery/account disable revokes all of that account's application sessions.

Protect all mutations, including sign-in, against CSRF with a session/preauth-bound token and exact-origin validation. GET never mutates journal data. Preauth tokens are short-lived and contain no account/journal data. Detailed security-library selection must implement these contracts without a custom cryptographic protocol.

Proposed initial shared rate limits: five failed sign-ins per normalized account/IP pair per 15 minutes and 30 attempts/IP per 15 minutes; generic responses, no account enumeration. Store limiter state in PostgreSQL for this small demo, keyed with protected hashes rather than raw passwords or long-lived IP logs. No instance-local-only limiter. Limit/bucket changes are operational parameters; expiry/cleanup is part of the auth implementation.

All private responses use Cache-Control: no-store. Cookies expire only after committed revocation; clear client caches/drafts. Idempotent sign-out of an absent/expired session clears the browser cookie without claiming an active session was found. Sign-out locks/revokes the current session with a consistent database lock order. Writes already authorized/locked before sign-out may complete first; after revocation commits, subsequent requests are denied. No long-lived authorization cache may undermine this contract.

## 2. Minimal persistence model

All app tables are in a non-public application schema. Browser Data API access to them is disabled. Runtime access uses a dedicated least-privilege non-owner role with no DDL and no BYPASSRLS. The migration role is separate. If RLS is enabled, use transaction-local owner context set only by the trusted server after session validation, and test pool reuse. Do not use Supabase service-role access as a substitute for owner constraints.

| Table | Key fields and invariants |
| --- | --- |
| accounts | UUID id, active/disabled state, timestamps |
| external_identities | provider, subject, account_id; unique provider/subject |
| journals | UUID id, owner_id unique, timezone, language en, week start Monday, order_version, timestamps |
| application_sessions | UUID id, secret_hash unique, account_id, created_at, expires_at, revoked_at; never raw secret |
| auth_attempt_buckets | protected key, window_start, attempt_count, expires_at; atomic shared limiter |
| entries | UUID id, owner_id, journal_id, type, content, journal_date DATE, task_state nullable, completed_at nullable, archived, priority boolean, inspiration boolean, daily_position, version and timestamps |
| collections | UUID id, owner_id, journal_id, title, description, archived, position, version, order_version and timestamps |
| entry_collections | owner_id, entry_id, collection_id, collection_position; unique entry/collection pair |
| change_records | UUID id, owner_id, entity/id, operation, previous/new values, command_id, UTC timestamp |
| command_receipts | owner_id + command_id unique, operation, request_fingerprint, completed result and UTC timestamp |

Enforce unique (owner_id,id) keys for owned parents and composite foreign keys for owner-consistent journal, entry and collection references. Enforce one journal per account; EntryCollection endpoints must share owner and journal. Explicit server checks complement database constraints. Browser-visible IDs alone grant no authority.

Task-state checks: core tasks have pending/completed/discarded; non-task entries have null state and completed_at. completed_at is nonnull only for completed tasks. Complete uses server UTC occurrence time; reopening clears it and records previous value. journal_date remains independent and can be historical; editing it does not fabricate historical completion. Future planning is specified in the next increment.

Initial validation limits (design choices): entry text 1–10,000 Unicode code points, title 1–120, description 0–5,000; reject whitespace-only required fields, preserve meaningful formatting. Mutation request body at most 64 KiB; reject larger bodies before processing. DATE values must be real YYYY-MM-DD dates. No future journal capture in this slice; later planning uses explicit destination, not a false actual occurrence. UUID fields must be well-formed.

Order deterministically by position then ID. Append under the owning journal/collection ordering lock. Move up/down uses expected order version and swaps adjacent positions atomically; missing neighbor is a no-op. Journal order_version serializes daily reordering (coarse locking acceptable for the demo); collection order_version protects its own ordering. Collection reorder never changes daily_position. Initial indexes: owner/journal/date/position/id, owner/state/date for earlier pending, owner/collection/position for memberships, owner/archive/title for collection list, owner/command_id unique, session secret_hash unique. Search is owner-filtered case-insensitive text/title matching; optimize only after measurement.

Capture/archive/unarchive and journalDate edits increment journal order_version when visible daily-list membership changes. Editing journalDate locks the journal ordering aggregate, removes the item from the source date and appends it after the last item on the destination date, using ID as final tie-break. Update journalDate, daily_position, entries.version, journal order_version, audit and receipt atomically; collection-local positions stay unchanged. Creation/link/unlink/archive that changes a collection list similarly advances its order_version. This coarse per-journal lock deliberately serializes cross-day moves and capture for the demo.

List default 50 items, max 100. Cursor binds owner context, filters, position/id and ordering version. If ordering changes across pages, return LIST_CHANGED and restart the list without overwriting drafts; do not promise snapshot pagination. Earlier pending has its own cursor.

## 3. HTTP contracts

Routes are proposed server endpoints, not an external public API commitment. Successful DTOs return only owner-safe account/entry/collection data and current versions. Every private route derives owner from the live application session, never from a caller-supplied ownerId. Reject unknown privileged fields.

| Endpoint | Required input | Success |
| --- | --- | --- |
| POST /api/auth/sign-in | email, password, preauth CSRF proof | 200 account/journal summary plus session cookie; no session secret/token in JSON |
| POST /api/auth/sign-out | CSRF proof | 204 after current-session revocation/expiry cleanup |
| GET /api/session | session cookie | 200 account/journal summary |
| GET /api/daily-log | date, cursor?, limit? | 200 entries with state, version, collection links, orderVersion and separate earlier-pending page |
| POST /api/entries | commandId, type, content, journalDate, collectionId? | 201 entry version 1; optional initial membership is atomic |
| PATCH /api/entries/:id | commandId, expectedVersion, content and/or journalDate | 200 updated original; type immutable in this slice |
| POST /api/entries/:id/state | commandId, expectedVersion, action complete/reopen/discard | 200 valid new task state |
| POST /api/entries/:id/signifiers | commandId, expectedVersion, priority, inspiration | 200 updated original without task-state change |
| POST /api/entries/:id/archive | commandId, expectedVersion, archived | 200 retained original/history |
| GET /api/entries/:id | session cookie | 200 owner-safe current original, links and version for editing/conflict comparison |
| GET /api/entries/:id/history | cursor? | 200 owner-safe audit page |
| GET /api/collections | query?, archived?, cursor?, limit? | 200 collection list and separately labeled matching original entries |
| POST /api/collections | commandId, title, description? | 201 collection |
| GET /api/collections/:id | cursor?, limit? | 200 collection/version and linked original entries |
| PATCH /api/collections/:id | commandId, expectedVersion, title/description/archived | 200 updated collection |
| POST /api/collections/:id/entries | commandId, entryId, expectedEntryVersion, expectedCollectionVersion | 200 original entry and membership |
| DELETE /api/collections/:id/entries/:entryId | commandId, expectedEntryVersion, expectedCollectionVersion, CSRF proof | 200 retained original and updated membership |
| POST /api/order | commandId, scope day/collection, date or collectionId, entryId, direction up/down, expectedOrderVersion | 200 current ordered IDs and orderVersion |

CSRF proof applies to all mutating routes even where omitted for brevity. Safe redirects are allowlisted same-application private routes, without external destinations. Search excludes archived entries by default, with an explicit archived filter when required. No automatic parse of numeric values from free text.

Errors use {code, message, requestId, fieldErrors?}; messages are English and safe. Codes: 400 MALFORMED_REQUEST, 401 SESSION_REQUIRED, 404 NOT_AVAILABLE for missing or foreign resources, 409 VERSION_CONFLICT / COMMAND_MISMATCH / INVALID_STATE / LIST_CHANGED, 422 VALIDATION_FAILED, 429 RATE_LIMITED, 413 PAYLOAD_TOO_LARGE, 503 SERVICE_UNAVAILABLE. Ownership is checked before returning current versions. Invalid login/uninvited identity uses one generic access failure. Current owned content for conflict comparison comes from an authorized read, not a cross-owner error payload.

## 4. Atomic commands, retries and audit

For authenticated business commands:

1. Begin transaction; validate and lock live application session/account in a consistent order.
2. Serialize (owner_id,command_id), compare canonical operation+payload fingerprint including expected versions.
3. If previously committed with identical request, return its original stored outcome before checking stale expectedVersion. If different, return COMMAND_MISMATCH.
4. Validate owned references, entity state, versions and ordering. Apply conditional updates and increments.
5. Write domain mutation, ChangeRecord and completed CommandReceipt in the same transaction. Commit before confirming success.

Rollback leaves no success receipt or partial data. Concurrent duplicates create one effect. Valid links already present are no-ops without duplicate history/version increments; replay still returns a consistent result. Link/unlink increments the single entries.version and collections.version when membership changes; expectedEntryVersion always compares entries.version. There is no separate membership version. Link/unlink also updates collection order_version when its list changes. Collection title edits do not rewrite Entry records. For collection creation plus new entry, avoid an implicit two-request atomicity promise: collection creation can succeed independently; UI retains it if later entry capture fails.

Keep command receipts for the slice lifetime; no silent expiry that breaks retries. Receipt retention/export/restore treatment is specified before portability implementation. Never store credentials or reusable session secrets in receipt results. Sign-in/out are explicit session operations outside business-command replay: a lost sign-in response may produce an additional session on retry; a sign-out replay is harmless.

Client reuses the original payload/key after a lost response or transient failure. It never auto-retries conflicts/validation/auth rejection. At most one retry per explicit Retry activation, no infinite loop. New edits or explicit conflict reapply use a new key and current version. Request timeout is 15 seconds as a proposed UI bound; timeout does not assert rollback and may require checking/retrying the original command. Every retry revalidates the live session.

## 5. Verification and operational gates

Domain tests have no cloud dependency; transaction/constraint tests use real isolated PostgreSQL; provider-specific sign-in/session configuration needs isolated identity integration tests. Test two accounts, distinct device sessions, concurrent commands, lost responses, partial failures and pool reuse. Verify FS-01 through FS-13, documenting actual evidence rather than marking specification review as test success.

Before hosted use: select/verify dependency versions and tooling, region, budget, provider configuration, credential reset/handoff, host HTTPS cookie behavior, database access roles, CI secrets and environment separation. Before production-ready claims: qualify backup/identity recovery under AC-75 and RNF-07. None of those gates has been executed or approved by this specification.
