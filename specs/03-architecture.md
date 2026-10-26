# Proposed architecture — v0.8

Status: logical architecture with a selected MVP stack. Confirmed platform: responsive web application with an account and shared data across devices. Cloud application hosting and a cloud database are confirmed. TypeScript/Next.js, Vercel, Supabase PostgreSQL/Auth are selected through the user-delegated vote; paid-plan budget, region and deployment details remain open.

## Boundaries and responsibilities

Modular application with a server and authoritative central storage. The web client uses an authenticated API. A relational database is proposed for transactions, references, and uniqueness constraints. Initial scale and personal use do not justify distributed services.

Flow: interface → use cases → domain → persistence contracts. Adapters implement storage, export, and clock access. The domain depends on neither interface, framework, nor database.

| Module | Responsibility |
| --- | --- |
| Journal | Journal, rapid logging, index, collections, temporal views, signifiers, tasks |
| Goals (optional) | Goal intention and lifecycle |
| Tracking (optional) | Versioned record/indicator definitions, capture, corrections, calculation strategies |
| Reflection | Reviews and decisions; coordinates migration through use cases |
| DataPortability | Schema validation, export, restore |

Calculations derive from current records or selected tasks according to each indicator's versioned definition. History is an audit log; event sourcing and a queue system are not proposed.

## Use-case contracts

- CreateGoal(input, commandId) → Goal or validation error.
- CaptureEntry(input, commandId) → Entry; no goal or collection required.
- CreateCollection(title, commandId) → Collection.
- LinkEntryToCollection(entryId, collectionId, commandId) → EntryCollection.
- GetIndex(query?) → collections and temporal references.
- GetDailyLog(date) / GetMonthlyLog(month) / GetFutureLog(range) → journal views.
- Reflect(period, content, links?, commandId) → free-reflection Review.
- StartTask(entryId, expectedVersion, commandId) → Entry.
- AddSubtask(parentEntryId, input, expectedVersion, commandId) → Subtask.
- ChangeSubtaskState(id, state, expectedParentVersion, commandId) → Subtask + Entry.
- CompleteTask(entryId, actualDate?, expectedVersion, commandId) → Entry.
- ReopenTask(entryId, expectedVersion, commandId) → Entry.
- DefineRecordType(collectionId, fields, commandId) → RecordSchemaVersion.
- CaptureRecord(recordTypeId, schemaVersion, values, occurredAt, commandId) → Record.
- CorrectRecord(id, values, expectedVersion, commandId) → Record.
- DefineIndicator(collectionId, strategy, source, target?, period?, goalId?, commandId) → IndicatorRevision.
- ReviseIndicator(id, definition, effectiveFrom, expectedVersion, commandId) → IndicatorRevision.
- MoveTask(entryId, destination, expectedVersion, commandId) → Entry + Movement.
- GetIndicators(collectionId, period, goalId?) → typed results, revisionId, and source references per indicator.
- StartReview(period, type, commandId) → Review with pending-item set.
- DecideReviewItem(reviewId, entryId, decision, commandId) → ReviewDecision.
- CloseReview(reviewId, expectedVersion, commandId) → Review.
- ExportJournal() / RestoreJournal(payload, commandId).

Errors distinguish validation, missing references, version conflicts, and storage failures; the interface offers concrete recovery actions. HTTP contracts will follow stack selection without coupling the domain to transport. Every operation receives an authenticated owner context.

## Architecture decisions

- ADR-001 resolved: responsive mobile/desktop web client; this decision alone does not imply synchronization or offline operation.
- ADR-002 product decision resolved: account with shared central storage. Proposed architecture: online access and version control; provider, engine, and authentication remain pending in ADR-003.
- ADR-003: [selected cloud stack](decisions/ADR-003-cloud-stack.md). Three independent votes select Next.js/TypeScript, Vercel and Supabase PostgreSQL/Auth for rapid client-demo delivery.

The proposed MVP fetches changes on opening, focus recovery, or refresh. WebSockets are not required. Writes require connection and expected version; users resolve conflicts explicitly. Offline support with deferred synchronization requires expanded specifications before implementation.

## Integrity and privacy

Persist changes and history atomically. Enforce reference, quantity, and commandId uniqueness constraints in the adapter where the store supports them. Do not persist progress as the authoritative source. Do not commit secrets or include personal content in technical logs. Export requires explicit owner action. Automatic backup/recovery mechanisms depend on the selected storage.

Completing/reopening a task saves state and history atomically. Counts derive from unique IDs rather than fabricated attendance records. Calculation strategies validate source and unit. Configurable schemas describe form fields rather than executable user code.

ADR-004 records domain generalization and replaces central gym rules. Proposed implementation: relational tables for owners, goals, tasks, schemas, records, and indicators; typed value payloads validated against versioned schemas. Physical design and indexes follow engine selection, without creating tables per goal.

## Access and remote operations

The application layer validates ownership and references in every use case; adapters always filter by owner. Reinforce isolation with engine constraints/policies where supported. Server credentials are never delivered to the browser.

The proposed MVP does not keep journals in persistent browser storage. Views/forms use memory; account caches are cleared on sign-out or identity change. Private responses must not enter public caches. Session mechanism, account recovery, and request protection will be defined with the identity provider.

Central-store backups and a test restoration are prerequisites for production. The provider must meet RNF-07 or motivate an explicit revision of that target.

## Domain priority — ADR-005

Journal and Reflection form a usable core without Goals or Tracking. Capture, organization, and qualitative review never require field or indicator definitions. Persistence includes Journal and EntryCollection links. RecordType and Indicator belong to a collection; Goal is optional. The interface starts with the daily log and index rather than a goal-configuration wizard.

Dates, symbols, and operations are described in the walkthrough. Extensions build on the core and preserve original entries. The selected stack is not implemented and no infrastructure is contracted at this stage. Application-authored copy and future code identifiers use English; stored user content is preserved unchanged.


## Cloud decision sequence

See [cloud architecture options](07-cloud-architecture-options.md) for the logical deployment, alternatives, date-stamped cost sources, constraints, and planned verification. See [specialist review](08-cloud-review.md) for architecture/development/QA contributions.

Proposed session design uses a revocable server-side application session checked on every private request, preserving AC-49 without relying only on token expiry. Proposed persistence makes business mutation, audit history, and command result atomic. Approved cloud processors may store/process service data under RNF-04; no journal content is sent to analytics or AI.

The audience is initially prospective clients viewing a portfolio/demo. Approach selection is complete; budget is open. Implementation follows the next specification step: identity/demo access, first-flow screens and database contracts, then operational design. See the [vote record](09-architecture-vote.md).
