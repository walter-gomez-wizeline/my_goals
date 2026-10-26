# Domain and calculations — v0.6

## General model

| Entity | Responsibility |
| --- | --- |
| Account / JournalSettings | Authenticated owner, language (English by default), IANA timezone, week start |
| Journal | Owner's personal journal; exists when the account is created, without goal configuration |
| Goal | Title, intention, optional dates, state; no universal unit or target |
| Entry | Task, event, or note; text, optional goalId, capture date, optional planning, collection links, task state when applicable |
| Subtask | Child task of a task-type Entry, text, state, order; one nesting level |
| RecordType / RecordSchemaVersion | Configurable form per collection, typed fields, versioned constraints |
| Record | Type and schema version, values by fieldId, occurrence date/time, optional entryId, voided flag |
| Indicator / IndicatorRevision | Collection, optional goalId, name, type, source, unit, period, optional target, target intent, optional baseline, effective dates |
| IndicatorTaskSource | Explicit task/subtask ID set for counts/milestones; no duplicates |
| Collection | Title, description/notes, order, archived flag; no goal required |
| EntryCollection | Unique entryId/collectionId link; multiple collection membership without copies |
| Movement | Origin, destination, entryId, instant, optional reason; identity remains unchanged |
| Review / ReviewDecision | Reflection, reviewed set, and decisions about pending items |
| ChangeRecord | Entity, operation, previous/new values, UTC instant, commandId |

Aggregates belong to ownerId derived from authenticated server identity. Child entities inherit ownership. References must belong to the same account and, where applicable, the same goal. All persisted entities have stable IDs, concurrency versions, and technical timestamps.

A Journal exists without goals. Entry belongs to the journal and supports optional goalId and zero or more collections through EntryCollection. A collection combines free text, entries, and optional structured records/indicators. A goal expresses intention and can link to entries and indicators; it is not a mandatory container. There is no required SessionDetails entity or central attendance rule. Gym tracking can use dated tasks and a count indicator; meals use records, weight uses observations, and courses use tasks/milestones.

## Fields and sources

MVP types: text, decimal, date, date/time, single selection, and link. Fields have stable IDs, required/optional settings, constraints, and explicit numeric units. Decimal precision is defined per field (up to four decimal places proposed); sums must not use binary floating-point arithmetic. Links are stored as data and are not automatically executed or fetched.

Each indicator has one source: a numeric field from a record type or an explicit task/subtask set linked to its collection. Multiple indicators may share a source. The MVP excludes arbitrary expressions, automatic unit conversion, and aggregation across collections.

Schemas and indicators have explicit revisions. Records retain schemaVersion; reports declare indicatorRevision. Retired fields remain readable historically. Changing meaning or unit requires a new fieldId. New revisions do not apply retroactively. Queries spanning revisions show separate segments.

## Activity and Bullet Journal semantics

Task states: pending, in progress, completed, discarded. A pending task can be started or completed; an in-progress task can be completed; pending/in-progress tasks can be discarded. Reopening a closed task puts it in progress. Events and notes have no task states.

Starting/completing a subtask puts a pending parent in progress. Completing all subtasks does not automatically close the parent. Discarding is not completion. Checklist percentage is informational and distinct from milestone progress.

Migrated (>) and scheduled (<) describe movements, not terminal states. Changing destination retains ID, state, and history without incrementing indicators. Capture, planning, and completion dates are independent. Moving to a month without a day clears the specific planned date while retaining the previous value in history.

## Calculation rules

Only nonvoided records and present values participate. No universal goal percentage is inferred, nor is causation inferred between activities and changes in outcomes.

| Type | Calculation and presentation |
| --- | --- |
| Sum | Sum field values by day, week, month, or cumulative range. Optional target: reference, minimum, or maximum; show difference without assuming higher is better |
| Completed-task count | Count selected IDs currently completed whose actual closure date falls in the period. With a positive target, show count/target and percentage |
| Latest observation | Show the latest value by occurrence date/time and historical series; do not sum observations. Break ties by creation instant, then ID |
| Milestones | Completed required items / total required items, equally weighted; show “No milestones” for an empty set. Discarded items remain in the denominator |

For sums with a minimum reference, fulfillment may display 100 × total/target; values above 100 are allowed. For a maximum limit, display consumption/limit and difference rather than positive progress.

For observations with distinct baseline B and target T: progress = 100 × (latest - B)/(T - B). This supports increases and decreases. Values may be negative or exceed 100; retain the value and only clamp a visual bar if present. B = T rejects percentage calculation. Without a baseline or target, show value/change without percentage. Baseline is explicit and is not silently taken from the first record.

Illustrative mathematical example: B=80 kg, T=75 kg, latest=78 kg → 40%. This is not a health recommendation; the application records user-entered targets.

Days, weeks (Monday through Sunday proposed), and months use journal timezone. No implicit partial-period prorating. Changing timezone does not reinterpret historical local dates. A day without meals shows “No records,” not 0 kcal. Explicit zero is valid if the field permits it.

## Integrity and concurrency

1. commandId is unique per owner. Retries return the previous result; reuse with different content causes a conflict.
2. Every mutation validates expectedVersion. Conflicts preserve local edits for review without silent overwrite.
3. Task changes and history are atomic. Derived counts read the current task; completion clicks do not generate synthetic measurements.
4. Reopening excludes the task from current counts; completing again updates its closure date. Current reports may change after correction/reopening and must expose this; history retains transitions.
5. Subtask changes increment the parent version to prevent closure against an outdated checklist.
6. Record corrections retain previous/new values and recalculate derived views; the audit log is not summed as new data.
7. Archiving does not delete records; voiding excludes records from indicators. Historical references are not cascade-deleted.
8. A review retains its initial set; new tasks do not block closure. Tasks resolved on another device are recognized.
9. Aggregates and references are saved atomically; restore validates everything before writing.

## Journal and temporal views as the core

Entry has journalDate (the day documented), UTC createdAt, type, content, within-day order, and optional signifiers. Tasks can additionally have current planning (day, month, future, or collection) and completedAt/actual closure date. Entries without a goal or collection are valid.

The index is a navigable projection of collections and temporal logs; physical page numbers are not maintained. Daily, monthly, and future logs are views over the same entries rather than copies. Multiple thematic membership does not create multiple current planning destinations.

Notes support brief or extended content. Priority and inspiration are optional metadata independent of state, with labeled symbols. Movement symbols describe history rather than replacing operational state.

A review may contain reflection alone. Decisions on pending tasks are required only when closing an explicitly started pending-item review. Writing reflection never requires processing all tasks. Changing day does not move entries or discard pending tasks.
