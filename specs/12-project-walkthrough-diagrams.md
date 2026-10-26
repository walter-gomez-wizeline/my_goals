# Project walkthrough diagrams — v0.11

Date: 2026-10-26. Read these six diagrams in order, from user experience to cloud delivery. They explain specifications, not implemented software. English labels follow RF-17. Solid arrows show the transition/dependency named in each section; dashed arrows identify optional paths or proposals.

Sources: [screen specification](10-mvp-screens.md), [domain](02-domain.md), [architecture](03-architecture.md), [requirements](01-requirements.md). The [architecture diagrams](11-architecture-diagrams.md) cover components, modules, sessions, transactional migration and conceptual data relationships.

## Step 1 — Follow a user's journey

Purpose: understand the central value before thinking about infrastructure.

```mermaid
flowchart TD
    Open["Open application"] --> Session{"Live application session?"}
    Session -->|"No"| Login["Sign in"]
    Login -->|"Success"| Daily["Open Daily log"]
    Session -->|"Yes"| Daily
    Daily --> Write["Capture a task, event or note"]
    Write --> Save["Save to the account journal"]
    Save --> Later["Find and revisit the original entry"]
    Later -.->|"Optional organization"| Link["Link to a collection without copying"]
    Link --> Read["Read the day or collection"]
    Later --> Read
    Read --> Reflect["Reflect on what happened"]
    Reflect -.->|"If there are commitments to reconsider"| Pending["Review pending items"]
    Pending --> Decide["Keep, complete, discard, migrate or schedule"]
    Decide --> Daily
    Reflect --> Continue["Continue using the journal"]
```

1. Authenticate only when needed, then land on the day rather than a setup wizard.
2. Capture without creating a goal, schema or collection.
3. Add thematic organization only when useful; all views reference the same entry.
4. Reflect without needing numbers. Reviewing pending items is optional and separate.

The save box represents success; failures/retries are expanded in Step 5. Sign-in failure stays on the access flow, with no private data exposure.

Traceability: AC-05/43/44/51/57/61/66/68.

## Step 2 — Understand the screen map

Purpose: distinguish navigation destinations from nested views and shared dialogs.

```mermaid
flowchart TB
    Access["S-01 Sign in"] -->|"Successful access"| Shell["Authenticated application shell"]
    Shell --> Daily["S-02 Daily log"]
    Shell --> Index["S-03 Collections and index"]
    Shell --> Planning["Planning navigation group"]
    Shell --> Review["S-07 Review"]
    Planning --> Month["S-05 Monthly log"]
    Planning --> Future["S-06 Future log"]
    Index --> Collection["S-04 Collection detail"]
    Shell -.->|"Account menu"| Settings["S-08 Settings and data"]
    Daily -.-> Entry["Shared entry editor and history"]
    Collection -.-> Entry
    Month -.-> Entry
    Future -.-> Entry
    Review -.-> Move["Move or schedule dialog"]
    Entry -.-> Move
    Shell -.-> Key["Symbol key dialog"]
```

1. Four main destinations: Daily, Collections, Planning and Review.
2. Month/Future are two Planning views, not extra main navigation tabs.
3. Collection detail opens from the index. Settings is a utility destination.
4. Editors, history, key and move dialogs reuse contextual UI rather than becoming mandatory new pages.

The shell is layout, not a ninth screen. It exposes all four destinations from any authenticated page. Entry links also open original entries across views; this map omits those cross-links for readability.

Traceability: S-01 through S-08; RF-10/13/14/15.

## Step 3 — Read a task's lifecycle

Purpose: separate operational state from planning movements. This diagram shows the full specified domain, including the later in-progress extension.

```mermaid
stateDiagram-v2
    state "Pending" as Pending
    state "In progress - later extension" as InProgress
    state "Completed" as Completed
    state "Discarded" as Discarded
    [*] --> Pending: Create task
    Pending --> Completed: Complete
    Pending --> Discarded: Discard
    Pending --> InProgress: Start when extension is enabled
    InProgress --> Completed: Complete
    InProgress --> Discarded: Discard
    Completed --> InProgress: Reopen under full domain contract
    Discarded --> InProgress: Reopen under full domain contract
    Pending --> Pending: Migrate or schedule
    InProgress --> InProgress: Migrate or schedule
    note right of Pending
        Planning changes retain task ID and state.
        Priority and inspiration do not change state.
    end note
```

1. A task begins pending and can be completed or discarded.
2. The optional extension adds explicit start/in-progress behavior.
3. Reopening follows the current full-domain contract and does not create another task.
4. Migrating or scheduling changes destination/history, never completion state. Closed tasks must be reopened before migration. Notes/events have no task lifecycle.

**Open specification issue:** the domain currently reopens to In progress, but the initial screen scope defers that state. Before implementation, agree either to include the minimal in-progress state in the first task flow or to explicitly revise the core-only reopening target. This diagram exposes the inconsistency rather than silently introducing a new transition. It does not remove reopening from AC-06.

Traceability: RF-02/05/08; AC-06/15/18/27–31/65.

## Step 4 — Walk through monthly reflection and migration

Purpose: show the decision process that preserves intentionality.

```mermaid
flowchart TD
    Period["Choose month to review"] --> Read["Read tasks, events and notes"]
    Read --> Reflect["Write and save a reflection"]
    Reflect --> Choice{"Review pending commitments now?"}
    Choice -->|"No"| Free["Leave with reflection saved"]
    Choice -->|"Yes"| Set["Start or resume a fixed review set"]
    Set --> Item["Open next undecided item"]
    Item --> Decide{"Choose a decision"}
    Decide -->|"Keep"| Keep["Retain existing destination and state"]
    Decide -->|"Complete"| Complete["Mark task completed"]
    Decide -->|"Discard"| Discard["Mark task discarded"]
    Decide -->|"Migrate"| Migrate["Choose month or collection destination"]
    Decide -->|"Schedule"| Schedule["Choose a later month with optional day"]
    Migrate --> Confirm["Confirm movement explicitly"]
    Schedule --> Confirm
    Keep --> Persist["Commit decision and any related changes"]
    Complete --> Persist
    Discard --> Persist
    Confirm --> Persist
    Persist --> More{"Undecided items remain?"}
    More -->|"Yes"| Item
    More -->|"No"| Finish["Finish pending-item review"]
    Set -.->|"Leave at any time"| Pause["Retain saved decisions and resume later"]
    Item -.->|"Leave at any time"| Pause
```

1. Saving a reflection never requires deciding every pending task.
2. Starting pending review establishes a fixed set, including relevant future commitments becoming current. Later-created tasks do not enlarge it automatically.
3. Keeping is valid. Moves require an explicit destination and confirmation.
4. Completion, discard, planning movement and review decision remain distinguishable in history.
5. Save failures preserve the undecided state and draft rather than pretending a decision was committed. Already-resolved items from another device are reconciled on refresh. A zero-item set can finish without entering the item loop.

Moving future commitments into the current month is explicit, not a background effect of the month changing. The diagram expands task decisions; event commitments becoming current are shown for explicit transfer under AC-62 without task completion/discard states.

Traceability: RF-05/06/14/16; AC-15–18/62/66–68.

## Step 5 — Follow saving, retries and conflicts

Purpose: explain what the user sees and why a repeated request must not create duplicate data. This is an interaction flow; the transaction details remain in architecture diagram 4.

```mermaid
flowchart TD
    Draft["Edit an in-memory draft"] --> Submit["Save with commandId and expectedVersion when applicable"]
    Submit --> Local{"Local form valid?"}
    Local -->|"No"| Validation["Show field errors and retain draft"]
    Validation --> Draft
    Local -->|"Yes"| Connection{"Online?"}
    Connection -->|"No"| Offline["Show unavailable status without queueing"]
    Offline --> Draft
    Connection -->|"Yes"| Server["Server verifies session, owner and command"]
    Server --> Result{"Server outcome"}
    Result -->|"Committed or identical replay"| Saved["Show Saved and persisted entry"]
    Result -->|"Version conflict"| Conflict["Preserve local draft and show current server version"]
    Conflict --> Resolve["Explicitly resolve edits with new commandId and current version"]
    Resolve --> Draft
    Result -->|"Session invalid"| Access["Hide private view and reauthenticate safely"]
    Result -->|"Forbidden or invalid data"| Reject["Explain safe error without exposing other accounts"]
    Reject --> Draft
    Result -->|"Known storage failure"| Failure["Keep draft and offer Retry"]
    Failure --> Retry["Retry same payload with same commandId"]
    Retry --> Server
    Server -.->|"Response lost or timeout, outcome unknown"| Unknown["Do not claim success or rollback"]
    Unknown --> Retry
```

1. “Saving…” starts while persistence is pending; “Saved” appears only after a successful server response.
2. Missing responses do not prove rollback. Retry the original payload with its original key to discover the committed result safely.
3. Editing the payload creates a new command; do not reuse the old commandId for different content. A conflict requires explicit resolution, never silent overwrite.
4. Same-account reauthentication may recover the in-memory draft; changing identity clears/conceals it. No journal content goes into sign-in URLs.
5. No durable offline queue is promised; reloading can lose unsaved edits. A second device obtains committed changes by opening/refreshing, not a realtime push requirement.

Traceability: RNF-01; AC-10/18/46–50/72–74.

## Step 6 — Understand environments and deployment

Purpose: separate where developers work, where checks run, and where a prospective client sees the demo. These are proposed logical environments, not provisioned resources or a promise of free staging.

```mermaid
flowchart LR
    subgraph Development["Development - proposed"]
        Local["Local Next.js application"]
        LocalDB[("Local or isolated nonproduction PostgreSQL")]
        Local --> LocalDB
    end
    Repo["Version-controlled application and SQL migrations"]
    Local -->|"Reviewed changes"| Repo
    Repo --> Checks["CI: static checks and automated tests"]
    Checks -->|"Pass"| Preview["Vercel test or preview deployment"]
    Preview --> TestDB[("Separate nonproduction database")]
    Preview --> TestAuth["Separate test identity configuration"]
    Preview --> Review["QA checks stable candidate"]
    Review -->|"Ready and deployment authorized"| Release["Controlled migration and release process"]
    subgraph Demo["Hosted client demo - proposed"]
        App["Next.js application on Vercel"]
        DB[("Supabase PostgreSQL with synthetic demo data")]
        Auth["Supabase Auth for isolated accounts"]
        Recovery["Backup and recovery procedure"]
        App --> DB
        App --> Auth
        DB -.-> Recovery
    end
    Release --> App
    Release -->|"Versioned schema migration"| DB
```

1. Local development, preview/test and hosted demo have separate credentials and data. Previews never access the hosted demo database.
2. CI gates a candidate, then QA checks relevant acceptance criteria. A passing build alone is not a release decision.
3. Controlled migrations and application releases must be compatible with overlapping versions. This box does not promise migration/app atomicity or automatic schema rollback.
4. The demo uses synthetic content and isolated accounts. Visitor provisioning and sign-in method remain to specify.
5. Test identity/database setup, regions, exact resources and cost are still open. Production readiness also requires the recovery drill, identity reconciliation and restored-session invalidation. Browser sign-in details are omitted here; see the architecture session diagram.

No deployment occurred while creating this documentation. A diagram arrow does not grant purchase/deployment permission.

Traceability: ADR-003; RNF-04/06/07; AC-40/43–50/69/71/74/75.

## Next design work

Resolve the core-only reopening contract, then use this journey/screen map to create low-fidelity Daily log and Collection wireframes. These diagrams explain existing requirements and open proposals; they do not introduce a new dashboard, goal wizard or tracking engine into the first demo.

## Validation evidence

QA performed read-only checks of source contracts for the six diagram topics. Focus incorporated the separation between optional review and capture, planning moves and task states, explicit conflict resolution and retries, and environment/identity isolation. Mermaid 11 successfully parsed all six new diagrams and the five existing architecture diagrams (11 total). This verifies syntax, not visual layout or runtime behavior. No application tests or cloud operations ran.
