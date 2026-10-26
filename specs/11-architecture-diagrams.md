# Architecture diagrams — v0.10

Date: 2026-10-26. These Mermaid diagrams explain the selected MVP architecture and proposed implementation contracts. They describe planned behavior, not deployed infrastructure. Source of truth: [architecture](03-architecture.md), [selected stack](decisions/ADR-003-cloud-stack.md), [domain](02-domain.md) and [requirements](01-requirements.md).

## 1. Cloud components and trust boundaries

Next.js provides both the interface and authenticated server use cases in one application. Supabase supplies identity and PostgreSQL. The diagram shows logical runtime communication, not a finalized region/network configuration. Sign-in transport and callback details remain to specify.

```mermaid
flowchart LR
    Browser["Mobile or desktop browser"]
    subgraph Vercel["Vercel - selected application host"]
        Web["Next.js web interface"]
        Server["Next.js server use cases"]
        Gate["Identity, live session and owner checks"]
        Adapter["PostgreSQL adapter and bounded pool"]
        Web --> Server
        Server --> Gate
        Gate --> Adapter
    end
    subgraph Supabase["Supabase - selected managed services"]
        Auth["Supabase Auth"]
        DB[("PostgreSQL")]
        Backup["Managed database backups"]
    end
    Browser -->|"HTTPS: pages and actions"| Web
    Browser <-->|"Proposed sign-in flow"| Auth
    Gate -->|"Verify provider identity during authentication"| Auth
    Gate -->|"Read live application session"| Adapter
    Adapter -->|"TLS: owner-scoped SQL"| DB
    DB -.->|"Plan-dependent backup process"| Backup
```

Browser code never receives SQL credentials. ApplicationSession and Account mapping live in application persistence; a valid provider token does not replace live session checks. Provider backup availability is not proof of tested recovery. Private responses bypass shared/public caches. Logs contain redacted operational data rather than journal content.

Traceability: ADR-003; RF-11/18; AC-44/45/71/73/74; RNF-04/06/07.

## 2. Modules and dependency direction

Solid arrows mean source-code dependencies; they do not describe network calls. Infrastructure implements interfaces owned by application/domain boundaries. Journal and Reflection remain usable without Goals or Tracking. All modules below run within the same application; boxes do not imply separate services.

```mermaid
flowchart TB
    UI["Presentation: screens and server endpoints"]
    UC["Application use cases: access, commands and transactions"]
    subgraph Domain["Domain modules"]
        Journal["Journal: entries, collections and planning"]
        Reflection["Reflection: reviews and decisions"]
        Portability["DataPortability: export and restore rules"]
        Goals["Goals: optional intention and lifecycle"]
        Tracking["Tracking: optional records and indicators"]
    end
    Ports["Ports: repositories, identity, unit of work and clock"]
    Infra["Adapters: PostgreSQL, Supabase identity and system clock"]
    UI --> UC
    UC --> Journal
    UC --> Reflection
    UC --> Portability
    UC -.->|"Later extension"| Goals
    UC -.->|"Later extension"| Tracking
    UC --> Ports
    Infra -->|"Implements"| Ports
```

Use cases coordinate cross-module actions. Domain behavior does not import a database driver, Next.js or Supabase SDK. Tracking calculations derive from current source records/tasks instead of an independently authoritative stored percentage. Concrete repository/ORM choices remain open.

Traceability: ADR-004/005; RF-02/05/07/16; AC-51/66/68.

## 3. Proposed sign-in and per-device session lifecycle

This successful-path sequence follows ADR-006: invited email/password access, server-verified Supabase identity and an eight-hour revocable application session. Failed authentication or an unmapped/disabled account never creates an application session. Every private operation authorizes its resources after validating the session. CSRF, rate limiting and cookie details are specified in the first-flow technical contracts, not expanded here.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant App as Next.js server
    participant Auth as Supabase Auth
    participant DB as PostgreSQL
    User->>Browser: Enter invited account credentials
    Browser->>App: Submit sign in
    App->>Auth: Verify email and password
    Auth-->>App: Verified provider identity
    App->>DB: Find active invited account
    DB-->>App: Internal account ID
    App->>DB: Create hashed application session
    DB-->>App: Session committed
    App-->>Browser: Set secure HttpOnly cookie
    Browser->>App: Request private journal
    App->>DB: Validate session and account
    DB-->>App: Active session and owner ID
    App->>DB: Read owned journal entries
    DB-->>App: Owned entries
    App-->>Browser: Return private response
    User->>Browser: Sign out this device
    Browser->>App: Request sign out
    App->>DB: Revoke current session
    DB-->>App: Revocation committed
    App-->>Browser: Expire session cookie
    Browser->>Browser: Clear account views and drafts
```

The browser clears its own memory after the response; the server cannot directly erase arbitrary browser memory. An unreachable session store must not grant access. Already in-flight operations and exact session/write coordination need definition in the session contract; the sequence promises denial for subsequent requests after committed revocation. Restoring backups must invalidate restored sessions to avoid resurrecting revoked access.

After revocation commits, later requests using that session are denied. Other devices retain their distinct sessions. These are session requirements, not additional messages in the diagram.

Traceability: ADR-006; RF-11/18; AC-49/50/73/74/75.

## 4. Proposed atomic task migration and retry

The same principle applies to other multi-entity mutations: business changes, history and command result commit together. A move updates the original Entry rather than creating another task. Identical retried commands return their prior result; version conflict is different from successful replay.

```mermaid
sequenceDiagram
    participant UI as Browser editor
    participant App as MoveTask use case
    participant DB as PostgreSQL
    UI->>App: Submit move command and expected version
    App->>App: Validate session and derive owner
    App->>DB: Begin transaction
    App->>DB: Serialize owner and command ID
    App->>DB: Compare request fingerprint
    alt Identical command already committed
        DB-->>App: Stored result
        App->>DB: End replay transaction
        App-->>UI: Return original result
    else Command ID reused for different input
        App->>DB: Roll back
        App-->>UI: Reject command mismatch
    else New command
        App->>DB: Check owned task and destination
        App->>DB: Check state and expected version
        alt A check fails
            App->>DB: Roll back
            App-->>UI: Return safe error or version conflict
        else Checks pass
            App->>DB: Update original task
            App->>DB: Append movement and audit history
            App->>DB: Store command result
            App->>DB: Commit transaction
            DB-->>App: Commit confirmed
            App-->>UI: Confirm saved movement
        end
    end
```

Failure before commit rolls back all effects. If the response is lost after commit, retry the same payload and commandId to obtain its original result. A failed save never counts as confirmed success.

Serialization/locking mechanism and SQL are not chosen here. Cross-owner references are rejected inside the command; expectedVersion prevents lost updates. For pooled connections, trusted owner context is transaction-local if used. A migration does not complete a task or create quantitative progress.

Traceability: RF-05/18; AC-15/16/18/45/46/72; RNF-01.

## 5. Core data relationships

Conceptual ER diagram, not executable schema. It intentionally excludes optional goals, subtasks and structured tracking to emphasize the first demo. Child ownership and owner-consistent references are enforced even where ownerId is not repeated visually. EntryCollection contains collection-local order; Entry retains its daily order.

```mermaid
erDiagram
    ACCOUNT ||--|| JOURNAL : owns
    ACCOUNT ||--o{ EXTERNAL_IDENTITY : maps
    ACCOUNT ||--o{ APPLICATION_SESSION : opens
    ACCOUNT ||--o{ COMMAND_RECEIPT : scopes
    JOURNAL ||--o{ ENTRY : contains
    JOURNAL ||--o{ COLLECTION : organizes
    ENTRY ||--o{ ENTRY_COLLECTION : links
    COLLECTION ||--o{ ENTRY_COLLECTION : groups
    ENTRY ||--o{ MOVEMENT : retains
    JOURNAL ||--o{ REVIEW : contains
    REVIEW ||--o{ REVIEW_DECISION : records
    ENTRY ||--o{ REVIEW_DECISION : receives
    ACCOUNT ||--o{ CHANGE_RECORD : audits
```

An Entry exists without a Collection or Goal. Multiple EntryCollection links do not duplicate it. Reviews may have no decisions when they contain only reflection. ReviewDecision may reference an existing movement; detailed keys and uniqueness rules will be specified in the physical schema. A stable Account ID is independent of the identity provider subject.

Traceability: RF-02/05/13/16; AC-13/15/51/57/66; domain identity and command records.

## Reading order and limitations

Read components first, dependencies second, session third, migration fourth and data relationships last. All five diagrams are documentation sources that can be rendered by a Mermaid-capable Markdown viewer. No deployment, cloud tests or recovery drills are implied. Detailed identity UX, database migrations, connection sizes, regions and runtime configuration remain open.

Architecture specialist reviewed the source contracts and supplied consistency checks incorporated here: browser outside trust boundaries, no direct browser SQL, dependency direction distinct from runtime calls, explicit session revocation and atomic command replay. Documentation review only; Mermaid visual rendering has not been executed in this environment.

Syntax validation update (2026-10-26): reproduced the original sign-in parse error with Mermaid 11, replaced unescaped semicolons in both sequence diagrams, and successfully parsed all five corrected diagrams. Parser validation does not imply visual layout verification or application execution.

For user journeys, screen navigation, task lifecycle, monthly review, save recovery and deployment environments, continue with the [six step-by-step walkthrough diagrams](12-project-walkthrough-diagrams.md).

Compatibility update (2026-10-26): diagrams 3 and 4 now use short individual messages without inline semicolons or trailing sequence notes. Explanations remain in Markdown outside the Mermaid blocks. The sign-in sequence also follows the current ADR-006 server-credential contract.
