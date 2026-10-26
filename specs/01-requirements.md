# Requirements and acceptance criteria — v0.12

The responsive web platform, shared account data across devices, and flexible Bullet Journal-based journal are confirmed. Detailed rules remain proposed unless marked otherwise. Each criterion will become an acceptance test when its flow is implemented. Existing RF, RNF, and AC identifiers are retained for traceability.

## RF-01 — Define goals (optional extension)

A goal has a title, intention, start date, optional end date, and active/paused/achieved/archived state. It can start without indicators and add one or more later. Each indicator defines an independent measure with a type, unit where applicable, source, and optional target. MVP types: sum, count of selected completed tasks, latest observation, and milestone progress.

- AC-01: creating a goal without a numeric target supports organizing courses and tasks; adding an indicator does not require recreating the goal.
- AC-02: reject incompatible configurations, such as summing body-weight observations to calculate change or dividing by a zero target. Validation depends on indicator type.
- AC-03: archiving retains records and history access; the goal leaves the active list.
- AC-04: changing a unit, source, type, target, baseline, or milestone set with history creates a revision effective from an explicit date. Reports identify the revision and do not silently rewrite the past. Retroactive revisions are not supported in the MVP.

## RF-02 — Rapid logging

Capture nonempty text as a task (•), event (○), or note (–); default local date is today; goal and collection are optional. Symbols have accessible labels. Entries for previous days are supported.

- AC-05: saving a note requires only text; it appears in the daily log with its date.
- AC-06: a task can be completed and reopened; reopening a completed or discarded task returns it to Pending, clearing its current completion timestamp while retaining history. Notes and events do not accept task states. In progress requires the later explicit Start/subtask extension (ADR-006).
- AC-07: editing or archiving an entry does not delete associated measurements; the interface explains this independence.

## RF-03 — Structured records (optional extension)

A collection supports user-defined record types without requiring a goal. Fields support text, decimal number, date, date/time, selection, and link. Each field has a label, required/optional setting, and unit where applicable. Examples: meal with description and kcal; weight observation with kg. A record may link to a task without inheriting its state.

- AC-08: two meals of 400 and 600 kcal on the same day sum to 1,000 kcal; weight is excluded from that sum.
- AC-09: completing a task does not change indicators except a task count or milestone indicator explicitly configured to include it.
- AC-10: retrying capture does not duplicate a record; two distinct meals with equal values are valid.
- AC-11: correcting or voiding a record recalculates dependent indicators and retains previous values in history.
- AC-12: past dates are allowed; actual observations cannot be future-dated. Zero and negative values follow explicit field constraints rather than a universal positive-quantity rule.

## RF-04 — Organize entries

Today shows entries for the selected date and separate access to earlier pending items. Month presents dated events and monthly tasks. Future groups commitments by later month. Collections group thematic entries and have a navigable index. These are views over shared data.

- AC-13: a collection entry also appears in its daily log without duplicating the entity or metrics.
- AC-14: an earlier open task remains visible among pending items even without migration.

## RF-05 — Review and migrate

Monthly review presents pending/in-progress tasks and future-log commitments relevant to the new month. Each pending item can be kept, completed, discarded, migrated to a month/collection, or scheduled in the future log. No transfer happens without user action.

- AC-15: migration retains ID and history, changes destination, and leaves a discoverable mark at the origin. The task retains its operational state and does not generate progress.
- AC-16: scheduling in the future log retains the original capture date and records the new temporal destination.
- AC-17: canceling a review retains saved decisions and allows resuming. Closing requires a decision for each pending item in the reviewed set. Keeping an item is a valid decision.
- AC-18: completed or discarded tasks cannot be migrated; a double click cannot migrate a task twice.

## RF-06 — Reflect and inspect progress

Review allows consulting tasks, events, notes, and records for a period; writing what worked, changed, and needs adjustment; and optionally linking collections, goals, or next tasks. Free reflection requires no metrics. Weekly review is optional and does not block daily capture.

- AC-19: a collection or goal with indicators shows each indicator's unit, period, definition revision, and source records; no overall percentage is inferred across incompatible measures.
- AC-20: absent records show “No records”; this does not mean zero consumption or an invented observation. For task counts, no completed tasks does produce zero.
- AC-21: a sum of 150 against a target of 120 shows 125%; limit targets show a comparison against the limit without presenting higher consumption as better progress.
- AC-22: a 78 kg observation after 80 kg shows 78 as the latest value and retains both in the series; it does not show 158 kg. With baseline 80 and target 75, progress toward the target is 40%. No indicator automatically marks the entire goal as achieved.

## RF-07 — Portability

- AC-23: export includes schema version, settings, goals, indicator and record definitions/revisions, captured values, tasks/subtasks, collections, movements, and reviews.
- AC-24: restoring into an empty store reproduces totals and links; incompatible versions or invalid references are rejected before data changes.
- AC-25: the MVP does not merge imports into existing data; it explains this restriction and allows exporting the current state.

## Quality requirements

- RNF-01: saving is never confirmed before persistence; failures leave the form recoverable.
- RNF-02: activity dates are local dates; creation/change instants are UTC; timezone configuration uses IANA names. Changing timezone does not move historical dates.
- RNF-03: controls support keyboard use, visible focus, labels, and states distinguishable without color alone.
- RNF-04: approved application-hosting/database processors may process journal data solely to operate the service. Approved identity services receive only the identity data they need, not journal content. Do not send journal content to analytics, AI, or unrelated third parties. Enforce owner isolation and authentication before remote exposure. Provider selection remains proposed until explicitly chosen.
- RNF-05: proposed read/save response target: p95 ≤ 500 ms with 10,000 entries, excluding network time. Verify in the selected environment and document the measurement.

## RF-08 — Subtasks and in-progress state (optional extension)

A task can represent a session, course, errand, or other activity. It has an optional planned date and one level of subtasks. States: pending, in progress, completed, and discarded. Migration/scheduling movements are recorded separately from operational state.

- AC-26: creating a course or activity requires a title; date, link, notes, and subtasks are optional.
- AC-27: starting a task or starting/completing a subtask puts a pending parent in progress.
- AC-28: completing all subtasks does not automatically complete the parent; the user confirms closure.
- AC-29: closing a parent requires resolving active subtasks by explicitly completing or discarding them; canceling preserves the previous state. A task without subtasks can be completed.
- AC-30: moving a task retains subtasks and history; subtasks do not become independent top-level activities.
- AC-31: adding or changing subtask states under a closed parent requires reopening it; text corrections retain history.

## RF-09 — Configure indicators (optional extension)

Each indicator belongs to a collection and defines its type and data source; it may optionally associate with a goal. A source is a numeric field of a record type in that collection or an explicit set of tasks linked to it. A collection supports multiple indicators or none. User code and arbitrary formulas are outside the MVP.

- AC-32: configuring a daily kcal sum does not require a calorie target; an optional target distinguishes reference, minimum, or maximum.
- AC-33: configuring latest weight displays the time series and latest value; an optional target and baseline enable directional comparison.
- AC-34: a completed-task count counts each selected ID once, even when closure is retried; subtasks do not count unless explicitly selected as an independent source.
- AC-35: reopening excludes a task from the current count; completing it again counts it once. The current closure date determines the period; history retains earlier closures.
- AC-36: observations use occurrence date/time and journal timezone; planning a future task is not measuring a future result.
- AC-37: selecting four required courses as milestones and completing two shows 2/4, 50%. Discarding one neither reduces the denominator nor counts as completion.
- AC-38: changing a course set or indicators creates an explicit revision. Each report identifies the set used; subsets from different revisions are not mixed.
- AC-39: completing all courses does not automatically establish certification. Passing an exam or obtaining a certificate can be a separate milestone, and the goal is closed explicitly.

## RF-10 — Responsive web experience

Confirmed: mobile and desktop use. Proposed core screen types: Sign in, Daily log, Collections/index, Collection detail, Monthly log, Future log, Review, and Settings & data. Four primary destinations: Daily, Collections, Planning (Month/Future), Review; Settings is a utility destination. Entry creation/editing and migration use contextual panels/dialogs. Goals and indicators remain optional later collection tools. See [MVP screen specification](10-mvp-screens.md) for routes, states and interaction contracts.

- AC-40: at widths of 360 px and 1280 px, users can create an activity, edit subtasks, and capture a record without horizontal scrolling in primary forms.
- AC-41: a weight goal presents meals and a weight series; a certification goal presents courses and milestones using the same configuration engine. No gym fields are mandatory.
- AC-42: a discarded subtask is not shown as a completed activity. Users can also see the discarded count.

## RF-11 — Account and access across devices

Confirmed: one account accesses the same journal from mobile and desktop. MVP proposal: authoritative central storage and online access. Instant updates through real-time channels are not required.

- AC-43: after saving a record on mobile, opening or refreshing the view on desktop with the same account shows the persisted change without file export/import.
- AC-44: unauthenticated users cannot read or modify journal data. Server authorization applies to every operation, including export and restore.
- AC-45: another account cannot access entities, history, or exports belonging to a different account, even with known identifiers.
- AC-46: when two devices edit the same entity version, only the first change is saved; the second receives a conflict and can inspect the current version without silent overwrite.
- AC-47: regaining focus or reopening a view fetches server changes without replacing a form containing unsaved edits. Conflicts preserve local edits for review.
- AC-48: offline saves are neither confirmed nor automatically queued. The form remains recoverable while the page stays open; reload may lose unsaved edits, with a warning before leaving when possible.
- AC-49: signing out invalidates the current server session, removes cached account data, and hides the journal on that device. Other sessions stay open unless a future explicit action closes them.
- AC-50: if authentication expires during editing, reauthentication is required before saving, without sending content to another account or showing it after an identity change.

## Additional remote-access quality

- RNF-06: remote traffic uses HTTPS; credentials and session identifiers are excluded from URLs and logs. Identity provider and session mechanism will be defined in ADR-003.
- RNF-07: proposed daily automatic backups with seven-day retention; target maximum data loss is 24 hours and target recovery time is 24 hours. Validate cost, provider support, and a test restoration before production. Export does not replace operational backups.

## RF-12 — Reusable configuration and evolution

- AC-51: users can capture text in an empty journal without a goal, indicator, collection, or template. Collections and optional tools can be added later without recreating entries.
- AC-52: historically used fields are not physically deleted or changed in type/unit; retire them from new capture or create another field. Records retain their schema version.
- AC-53: reject indicators referencing sources outside their collection or owner, nonnumeric sum fields, or duplicate task selections; do not publish partial changes.
- AC-54: records lacking an optional field value are excluded from its indicator, and coverage is reported. Explicit zero participates and is distinguished from missing data.

## RF-13 — Index and collections

A collection is a thematic space with a title, ordered entries, and optional tools. No goal or schema is required. Index, future log, monthly log, and daily log are the method's core collections; custom thematic collections are unrestricted.

- AC-55: the index opens collections and temporal logs; title/text search finds free-form entries without indicators.
- AC-56: creating “Ideas” requires only a title and supports mixing notes, tasks, and events, ordering them, and adding extended notes.
- AC-57: linking an existing entry to a collection retains its ID and daily-log reference; an entry supports multiple collections without copies. Removing a link does not delete the original.
- AC-58: archiving a collection retains entries and historical links; it does not discard tasks or delete records.

## RF-14 — Future, monthly, and daily logs

The journal date represents the entry's day, independent of capture instant and planning. The monthly log presents a calendar of dated entries and a monthly task list. Future groups commitments by later month without requiring an exact day.

- AC-59: creating a future task for December without a day displays it in December without inventing a date or recording completion.
- AC-60: the monthly log distinguishes calendar and monthly tasks and locates the same entry without duplication.
- AC-61: opening a day supports capturing and ordering entries as needed; empty days and advance plans are not mandatory.
- AC-62: at the start of a month, relevant future commitments are presented for explicit transfer, retention, or discard; they are never silently transferred.

## RF-15 — Key and signifiers

Basic key: • pending task, X completed task, ○ event, – note, strikethrough for discarded tasks, > migration mark, and < scheduling into the future log. Priority and inspiration are optional signifiers independent of type and state. In-progress state and subtasks are identified as digital extensions.

- AC-63: the key is accessible from the daily log; every symbol has an accessible text label and consistent meaning across views.
- AC-64: priority/inspiration can be added or removed without completing, migrating, or changing an entry's indicators.
- AC-65: migrated tasks retain operational state, movement mark, and origin/destination link; adding a signifier to a note does not give it a task state.

## RF-16 — Perspective without mandatory measurement

- AC-66: a review supports reading what happened and saving reflection without a goal, percentages, targets, or numeric records.
- AC-67: review distinguishes completed, pending, discarded, and migrated items; it does not present every movement as an achievement.
- AC-68: users can keep pending items without moving them. Earlier pending items remain accessible and are never automatically migrated when the day changes.

## Delivery order

First: RF-02, RF-04, RF-05, qualitative RF-06, RF-07, RF-10, RF-11, and RF-13 through RF-16. Then: RF-01, RF-03, RF-08, RF-09, and RF-12. Extension criteria are retained but are not prerequisites for capture. See the delivery plan.

## RF-17 — Project and interface language

Confirmed by the user: all project specifications and application-authored interface text use English. Existing RF/RNF/AC identifiers remain stable. User-authored titles, notes, and other content can use any language and remain unchanged.

- AC-69: documentation, examples, navigation, action labels, validation messages, empty states, accessibility labels, and the symbol key are in English.
- AC-70: English is the default interface language; entering content in another language preserves it without automatic translation. Language choice does not change the configured timezone, historical dates, stored units, or numeric values.


## RF-18 — Cloud operation (confirmed direction; implementation proposed)

Host the application and its authoritative database in cloud services. Compare alternatives and decide step by step before implementation; cloud-provider, framework and plan selection are not implied by this requirement. See ADR-003 and cloud architecture options.

- AC-71: the selected deployment persists journal data in its designated cloud database; restarting application compute does not lose committed entries. Accessing from another device uses the same account-owned data.
- AC-72: application mutations, audit history, and owner-scoped command receipts/results commit atomically. Retrying after a committed response is lost returns the original result without duplicate effects; reusing the key with a different request is rejected.
- AC-73: each private request verifies a live, revocable application session as well as identity. After current-session sign-out commits, subsequent requests using that session are denied; another device's session remains valid. A token signature alone is insufficient.
- AC-74: preview/test deployments cannot access production data or secrets. Authenticated journal responses are excluded from shared/CDN caches; cached views and drafts cannot expose a previous account after identity changes.
- AC-75: before production, an isolated restore drill records backup age, operator actions and elapsed time from incident declaration to verified service restoration. Verify account mapping, entries, links, history and schema; document identity-provider recovery separately and invalidate restored application sessions. Compare results with RNF-07 rather than assuming provider backups prove recovery.

New cloud criteria are planned checks, not executed tests. QA must also qualify transaction-local owner context reuse, connection exhaustion, controlled migrations and private cache behavior on the chosen stack.


First-flow baseline: [ADR-006](decisions/ADR-006-first-flow-contracts.md) defines invited email/password access, eight-hour revocable opaque application sessions and the explicit reopen-to-Pending revision. [FS-01 through FS-13](13-first-flow-spec.md) map the initial implementation slice to existing criteria; later core/extension criteria are not removed or claimed passed. No software tests have executed.
