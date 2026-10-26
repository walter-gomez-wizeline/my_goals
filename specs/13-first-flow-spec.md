# First journal flow — v0.12

Date: 2026-10-26. Status: implementation specification baseline assembled by Focus; application not implemented. Product changes are recorded explicitly in [ADR-006](decisions/ADR-006-first-flow-contracts.md). UI/UX and QA reviewed the source requirements; architecture supplied access/persistence contracts. No usability study or application tests have run.

## Outcome and scope

An invited person signs in, writes a note/task/event without setup, organizes it in collections, changes a task's state and sees the same committed data after refresh on another device.

This is an internal implementation milestone, not the full client-ready Bullet Journal core. Monthly/future logs, intentional planning migration, reflection, export/restore and operational qualification still follow before claiming full core coverage. This explicitly refines the earlier first-slice/demo shorthand in specs 09 and 10: completion belongs here; migration is the next increment. Optional goals, subtasks, structured fields and indicators stay later.

## Design decisions

- Email/password sign-in for operator-invited isolated synthetic accounts, no public signup.
- Eight-hour, revocable opaque application sessions, as in ADR-006.
- Reopen → Pending; Start/In progress belongs to a later extension.
- Daily log is the landing screen. No goal, collection or schema is a prerequisite for capture.
- Desktop sidebar and mobile bottom navigation share Daily, Collections, Planning and Review. In this internal slice, Planning/Review are visibly unavailable and not clickable dead links; activate them when their flows exist. A hosted complete-core demo must include them.
- Capture defaults to Note. Task and Event are explicit choices; journal date is inherited from the displayed day.

## Walkthrough and acceptance scenarios

| Scenario | Action and observable result | Existing criteria |
| --- | --- | --- |
| FS-01 | Invited user signs in and opens a safe requested page or Daily log. Invalid/uninvited identity receives a generic failure and no application session | AC-44/50/51/73 |
| FS-02 | Save Note, Task and Event for today or a historical day. Refresh preserves ID, content, type and journal date. No goal/collection is required | AC-05/06/51/61/70/71 |
| FS-03 | Blank content fails without partial data. Saving feedback is replaced by Saved only after commit. Failure keeps the draft | RF-02, RNF-01 |
| FS-04 | Create a title-only collection, link one original to two collections, unlink one membership and retain the daily original/other membership | AC-13/56/57 |
| FS-05 | Title/text search finds owned collections and entries, including uncollected entries. Empty result differs from retrieval failure | AC-55 |
| FS-06 | Complete task → Completed. Reopen → Pending with completion timestamp cleared. Discard is distinct from Archive; notes/events reject task-state actions | AC-06/07; ADR-006 |
| FS-07 | Change order in a day or collection with accessible Move up/down actions. Collection order does not move daily order. Priority/Inspiration toggles do not change state | AC-56/61/64 |
| FS-08 | Another device with a distinct session sees saved entries, links and state on open/refresh. Stale edits receive a conflict that preserves the local draft | AC-43/46/47/71 |
| FS-09 | A second account cannot read/update/link/unlink/search/transition known foreign IDs; no partial membership or leaked content | AC-44/45/72 |
| FS-10 | Lost response after commit and concurrent duplicate submit both yield one effect/history entry. Same key with changed payload fails | AC-72 |
| FS-11 | Sign-out revokes the current session; replay fails while a distinct other-device session works. Failed sign-out is not falsely confirmed | AC-49/73 |
| FS-12 | Expiry conceals private views and same-account reauthentication can recover an in-memory draft. Identity switch clears/conceals prior drafts and caches | AC-50/74 |
| FS-13 | Main flows work with keyboard and at 360/1280 px, with English labels and unchanged user content | AC-40/69/70; RNF-03 |

FS criteria are scenario references, not replacements or renumbering of AC requirements. Optional-extension portions of existing AC-40 are tested in their own increments, not falsely marked fully passed here.

## Wireframes and interaction annotations

Open [the low-fidelity storyboard](wireframes/first-flow.html). It contains W-01 Daily desktop, W-02 Collection desktop, W-03/W-04 mobile layouts, W-05 Sign in, W-06 Collections index, W-07 state copy. Boxed controls are design notation, not functional buttons.

- Daily hierarchy: date/Today → type/text composer → ordered entries → Earlier pending items. Earlier pending items are references to original dates, not migrated copies.
- Collection hierarchy: breadcrumb/title → description → Add entry/Link existing → mixed entries with original date and collection links. Adding inherits membership and exposes editable journal date.
- Entry action panel: Edit content/date, Complete/Discard/Reopen for tasks, Priority/Inspiration, Link to collection, Remove from collection in collection context, Move up/down, Archive, View history. Planning moves are omitted until the next increment; membership linking must not masquerade as migration.
- Collection action panel: Edit title/description, Archive, Restore. Archived collections are readable; restoration is required before adding membership/content.
- New collection dialog: title required, description optional. Link picker searches owned entries, shows date/type and can link existing originals without copies.
- Shared entry editor: side panel/dialog on desktop and full-height sheet on mobile. Visible Close/Save, accessible title, focus management, escape/close behavior and unsaved-change warning. Preserve scroll/date when returning.
- Reorder actions stay view-local and are accessible without dragging. Long text wraps or expands without obscuring entry actions.

## Required states

| State | Interaction |
| --- | --- |
| Initial loading | Loading treatment, not empty journal copy |
| Empty daily log | “Start with a note, task, or event.” and available composer |
| Empty collection | “Add an entry or link one from your journal.” |
| No search matches | Distinct from both empty collection and failed retrieval |
| Saving | Disable duplicate submit and show Saving… while keeping the draft |
| Committed | Announce Saved after server success, then clear submitted composer |
| Failed save/offline | Retain draft and offer Retry. No durable offline queue; reload can lose it |
| Conflict | Keep local draft, show latest owned server version, explicit reapply with a new command |
| Expired session | Conceal account view, retain safe in-memory draft for same-account reauthentication only |
| Unavailable/foreign item | “Not available” without title/content disclosure |
| Unsaved navigation | Keep editing or Discard changes; never silently replace input on refocus |

No private form bodies enter auth URLs, persistent browser storage or operational logs. Never restore a draft to another identity. Sign-out or identity change clears all account-scoped views and drafts. Closing an editor follows Keep editing/Discard changes and clears only the discarded editor draft. Page termination ends in-memory draft availability; no durable draft recovery is promised.

## Completion gate and next increment

Before considering this slice complete: implement technical contracts, verify FS-01 through FS-13 and record actual outcomes. No criterion passes from specification review alone. Hosted demonstration additionally needs approved budget/region, secure invite/reset handoff, deployment isolation and the relevant recovery checks.

Next increment adds explicit task migration, Monthly/Future and Review; portability and operational qualification complete the core delivery plan. The selected architecture is unchanged.


## Specification validation evidence

UI/UX supplied desktop/mobile layout and state recommendations; architect supplied concrete identity/session/schema/command contracts; planner supplied the ordered 14-task proposal. QA reviewed the staged functional, technical and decision documents, identified missing signifier fields and ambiguous membership/date ordering, then re-reviewed after fixes. Final document verdict: ready for tooling selection, no remaining specification blockers in that pass. This does not certify application security or behavior.

The static storyboard was opened in isolated headless Chrome at 1280 and 360 px; page width was checked and desktop Daily/mobile Collection screenshots were visually inspected. The storyboard contains no application event handlers or persistence. All 12 Mermaid blocks in the merged specification set parsed with Mermaid 11. Local links, 75 stable AC IDs and 14 unique task IDs were checked. No application, cloud, identity or recovery tests ran.
