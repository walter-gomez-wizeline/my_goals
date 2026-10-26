# MVP screen specification — v0.12

Date: 2026-10-26. Status: Focus's proposed screen scope, subject to refinement with the user. Architecture remains as selected in ADR-003. This is an interaction specification, not implemented UI or validated user research.

## 1. Product decision

Start at the daily log, not an analytics dashboard or goal wizard. The first demo must make it easy to capture something, find it later, and reconsider a pending commitment. Preserve Bullet Journal's index, collections, daily/monthly/future logs, reflection and intentional migration.

Eight screen types cover the full core MVP. Month/Future are sibling views under one Planning navigation destination. Collection detail is nested under Collections. Settings is a utility page, not a main tab. Creating/editing entries and migration use shared contextual surfaces instead of adding standalone screens.

## 2. Screen inventory

| ID | English title | Proposed route | Purpose and primary action | Traceability |
| --- | --- | --- | --- | --- |
| S-01 | Sign in | /sign-in | Access the account; Sign in | RF-11; AC-44, AC-49, AC-50 |
| S-02 | Daily log | /journal?date=YYYY-MM-DD | Capture/revisit a day; Add entry | RF-02/04; AC-05/06/14/51/61/68 |
| S-03 | Collections | /collections | Navigable index and search; New collection | RF-13; AC-55/56/58 |
| S-04 | Collection | /collections/:id | Read a thematic space; Add entry or Link existing entry | RF-13; AC-13/56/57/58 |
| S-05 | Monthly log | /planning/month?month=YYYY-MM | Calendar and monthly task list; Add monthly task | RF-14; AC-60/62 |
| S-06 | Future log | /planning/future | Commitments grouped by later month; Add commitment | RF-14; AC-59/62 |
| S-07 | Review | /review | Reflect on a period and optionally review pending items; Save reflection | RF-05/06/16; AC-15–18/66–68 |
| S-08 | Settings & data | /settings | Timezone, data export/restore and account access; contextual action | RF-07/11; AC-23–25/49; RNF-02 |

These are screen types, not eight mandatory steps. An authenticated user normally enters directly at S-02. The root route resolves to the daily log for authenticated users and Sign in otherwise.

## 3. Navigation and layout

Desktop: persistent sidebar with Daily log, Collections, Planning and Review. Planning exposes Month/Future tabs. Sidebar footer contains Key and Settings; account menu contains Sign out. Main content has a readable bounded width and a clear primary action. Secondary actions use an accessible menu.

Mobile: bottom navigation with four labeled destinations: Daily, Collections, Planning, Review. Settings/account actions remain in the header menu; Month/Future tabs stay inside Planning. Capture is available on relevant screens as a labeled Add entry button, not an unlabeled floating icon. At 360 px all primary forms and navigation fit without horizontal scrolling.

Date, period, search query and collection URL survive ordinary navigation where appropriate. Selection of Today resets to the current journal-local date. Changing a date or collection with unsaved edits offers Keep editing or Discard changes; it never discards silently.

## 4. Screen contracts

### S-01 — Sign in

Purpose: reach the private journal with minimal friction. Content: product name, brief description, sign-in form and authentication feedback. No mandatory goal onboarding or feature tour.

ADR-006 now selects invited per-user email/password access, operator-assisted recovery and no public signup. Credential handoff/reset mechanics must be verified before external invitations. Do not build a public sign-up button or promise a one-click anonymous demo in this specification. Client demos use synthetic content and isolated accounts once access is defined.

States: idle, submitting, validation failure, authentication failure, unavailable and expired session. Successful authentication opens the original authorized destination if safe; otherwise the daily log. Never include secrets in navigation URLs. Authentication errors do not reveal journal content.

### S-02 — Daily log

Hierarchy: day/date navigation and Today action → quick capture → ordered entries → separately labeled Earlier pending items. The latter links to originals and does not copy/migrate them automatically.

Quick capture: text field, type selector (Note default, Task, Event) and Add entry. Date is inherited from the open day. Collection is optional and disclosed after basic capture; no goal or schema field blocks saving.

Each entry shows symbol plus accessible type/state label, text, optional signifiers and collection links. Tasks support Complete, Reopen and Discard as appropriate; notes/events do not have completion controls. Secondary actions: Edit, Link to collection, Plan/Move when allowed, Archive and View history. Core MVP does not expose in-progress/subtasks until their extension increment.

Entry menus provide Move up / Move down controls for ordering within the day; dragging is optional, never required. Collection menus provide the same controls for collection-local order. Reordering a collection does not change daily-log order or another collection’s order. Persist order changes with conflict handling.

Empty copy: “Start with a note, task, or event.” Save feedback: “Saving…” then “Saved” only after persistence. Failures retain input and offer Retry. A historical day stays valid for capture. New unsaved input is never replaced by background refresh.

### S-03 — Collections / index

Content: named collection list, title/text search, active/archived filter, links to Daily/Month/Future, New collection. Search results identify context and open the original entry, including entries with no collection.

New collection requires only title. Empty copy: “Create a collection to bring related entries together.” No-results copy is distinct from an empty journal. Archiving is reversible via a Restore collection action and never discards its tasks.

### S-04 — Collection detail

Content: title, description/extended notes, ordered mixed entries, linked origin dates, Add entry and Link existing entry. Mixed entry types use the same components as the daily log.

New entries inherit the collection but show a journal date defaulting to today. Existing entries are linked by ID, never copied. Removing membership is labeled Remove from collection and explains that the original remains in the journal. An entry can belong to more than one collection. Archived collections remain readable with a clear banner and Restore collection action; new membership/entries require restoration first as a proposed interaction rule.

No required goal, chart, routine or structured table in the core. Tools for later extensions can appear here when implemented, without blank placeholder dashboards in the first demo.

### S-05 — Monthly log

Two labeled sections: Calendar and Monthly tasks. Desktop may place them side by side; mobile stacks them. Calendar uses a dated agenda/list initially rather than requiring a complex drag-and-drop calendar. Selecting a day opens its daily log.

A monthly task may lack an exact day; distinguish that from a dated commitment. Open current-month future commitments in a “Ready to review” section linking to explicit review/transfer actions. Starting a month never silently moves entries.

### S-06 — Future log

Show later months as groups with month/year labels. Add commitment chooses Task/Event, text and destination month, with an optional day. No exact day is invented when absent. Pagination/range navigation supports later months without an infinite calendar.

Present planning context and links to originals. When a month becomes current, its items surface for monthly review. Past planned items remain discoverable through history/month views; no time transition deletes them.

### S-07 — Review

Choose period and read relevant tasks, events and notes. First section: free reflection with optional prompts “What happened?”, “What worked?” and “What will I change?”. Save reflection works without metrics or pending-item decisions.

Separate action: Review pending items. This explicitly starts a resumable decision set. For each item: Keep, Complete, Discard, Migrate or Schedule. A move requires destination selection; the prior date/state and destination are visible before saving. Show counts of decisions remaining, not an overall productivity score.

Finish pending review requires a decision for every item in its original set; Save and leave retains committed decisions. Tasks resolved from another device are acknowledged on refresh. New tasks do not unexpectedly enlarge the original set. Reflection remains editable independently of pending-review closure.

### S-08 — Settings & data

Sections: account, journal timezone, Export data and Restore data. English interface is default; do not add a language-picker feature merely because content can use other languages. Explain that timezone changes do not move historical local dates.

Export shows in-progress/failure/success feedback and produces the current supported schema. Restore first validates file version/references and journal emptiness, presents a summary, and applies only after explicit confirmation. An existing journal blocks merging with a clear message and Export current data action. Do not add Clear journal to work around this rule.

Sign out remains available here and from account menu. If it fails, do not claim the server session was revoked; offer Retry. Warn about unsaved edits and clear all account-scoped views/drafts when identity changes.

## 5. Shared contextual surfaces

| Surface | Desktop | Mobile | Required behavior |
| --- | --- | --- | --- |
| Entry details/editor | Side panel or dialog | Full-height sheet | Edit type-appropriate content, view origin/history, retain unsaved draft |
| Create/link collection | Dialog | Sheet | Minimal title form or existing-entry picker; same IDs |
| Move/schedule task | Dialog | Sheet | Destination kind + month/day/collection; explicit confirmation, no automatic migration |
| Key | Small dialog | Sheet | Symbol plus English label; explain extensions separately |
| Version conflict | Dialog/panel | Sheet | Keep local draft beside current server content; explicit resolution/reapply, never blind overwrite |
| Restore confirmation | Dialog | Sheet | Validation summary and confirmation before atomic mutation |

The shared entry editor includes explicit Priority and Inspiration toggles (on/off), independent of entry type, task state and migration. Toggling either changes no completion state or metric.

Every dialog/sheet has an accessible name, keyboard access, visible focus, Escape/Close behavior, and returns focus to its invoker. Closing with edits follows unsaved-change rules. No essential action depends on hover, color or dragging.

## 6. Cross-screen states and data safety

- Distinguish initial loading, empty content, no search results, populated state and retrieval failure. Retrieval failure never appears as an empty journal.
- For writes show pending state, prevent accidental duplicate submits, retain command identity for retries and confirm only after server success. Server idempotency remains required.
- Offline/unavailable: explicit status, no queued-sync promise, recoverable in-memory draft while the page remains open; reload may lose it.
- Expired session: conceal private views, allow same-account reauthentication without discarding the in-memory draft. Discard/conceal that draft before another identity can access the app. No draft content in auth URLs.
- Unknown/unauthorized collection or entry: safe “Not available” view without leaking title/content or offering ownership-changing workarounds.
- Historical movement labels link origin and destination; migration is not completion. Completed/discarded entries remain distinguishable.
- Navigation, saving/error status and validation messages have readable text and accessible announcements. Verify keyboard use and mobile/desktop behavior; no usability study is claimed.

## 7. Delivery slices

First thin slice: S-01 + S-02 + S-03/S-04 and shared entry/collection actions; demonstrate capture, ownership, persistence and findability. Task completion/reopening belong to this internal slice; intentional planning moves are the next increment. This explicitly refines the earlier demo-sequence shorthand and does not remove migration from the complete-core scope.

Full core MVP: add S-05/S-06, S-07, S-08 and their states, preserving all required core-method and portability behaviors. A partial slice is not advertised as complete Bullet Journal support.

Later extensions: goal views, subtask/in-progress UI, structured record forms and indicator charts. No dedicated analytics dashboard, goal wizard, routine builder, marketing landing page, admin console or notification center is part of this screen decision.

## 8. Focus decision and remaining inputs

Propose these eight screen types and four primary navigation destinations as the minimum complete core. Daily capture, index/collections and an explicit review are the demonstration's central story. This is a design recommendation, not user-research evidence or an implemented interface.

Next: low-fidelity wireframes for Daily log and Collection first, then Planning and Review; use ADR-006 and the first-flow contracts to finalize S-01. Visual branding and component styling can be resolved during wireframing without reopening the selected stack. QA should verify the interaction contracts before implementation.


## 9. Specialist review evidence

UI/UX independently recommended sign-in, daily log, collection index/detail, planning with Month/Future subviews, review, settings and shared editors. QA independently mapped the same functional coverage to current criteria and flagged loading/error separation, cross-account protection, conflict handling and the distinction between the first slice and the complete core. Focus resolved their outputs into eight screen types with four primary destinations. Both reviews were read-only; no prototype, usability study or application test was executed.

QA also reviewed the staged screen specification. Its two remaining gaps were addressed: explicit keyboard-operable ordering controls with view-local order, and independent Priority/Inspiration toggles. This is document-level review only.


## Diagram cross-reference and resolved lifecycle decision

See the [walkthrough diagrams](12-project-walkthrough-diagrams.md) for navigation and interaction flows. ADR-006 explicitly resolves core reopening to Pending; later Start/subtask activity enters In progress. See [first-flow specification](13-first-flow-spec.md), [wireframes](wireframes/first-flow.html) and [technical contracts](14-first-flow-technical-contracts.md) for implementation-ready scope and states.
