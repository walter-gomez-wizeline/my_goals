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

This is the existing proposed revocable application-session contract made visible. It does not select email/password, OAuth, invitation flow, cookie lifetime or token storage details. Authentication failures end before creating an application session. Every private operation authorizes its resources after validating the session.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Auth as Supabase Auth
    participant App as Next.js server
    participant DB as PostgreSQL
    User->>Browser: Sign in
    Browser->>Auth: Complete chosen authentication flow
    Auth-->>Browser: Authentication result
    Browser->>App: Establish application session
    App->>Auth: Validate provider authentication result
    Auth-->>App: Verified provider and subject
    App->>DB: Resolve internal Account and create ApplicationSession
    DB-->>App: Committed session reference
    App-->>Browser: Proposed Secure HttpOnly session cookie and private destination
    Browser->>App: Private request with session cookie
    App->>DB: Check expiry, revocation and owner mapping
    DB-->>App: Live session and internal owner
    App->>DB: Authorized owner-scoped operation
    DB-->>App: Result
    App-->>Browser: Private response
    User->>Browser: Sign out this device
    Browser->>App: Revoke current application session
    App->>DB: Mark this session revoked and commit
    DB-->>App: Revocation committed
    App-->>Browser: Expire cookie and clear account views and drafts
    Note over Browser,DB: Later requests with this session are denied. other device sessions remain valid
```

The browser clears its own memory after the response; the server cannot directly erase arbitrary browser memory. An unreachable session store must not grant access. Already in-flight operations and exact session/write coordination need definition in the session contract; the sequence promises denial for subsequent requests after committed revocation. Restoring backups must invalidate restored sessions to avoid resurrecting revoked access.

Traceability: RF-11/18; AC-49/50/73/74/75.

## 4. Proposed atomic task migration and retry

The same principle applies to other multi-entity mutations: business changes, history and command result commit together. A move updates the original Entry rather than creating another task. Identical retried commands return their prior result; version conflict is different from successful replay.

```mermaid
sequenceDiagram
    participant UI as Browser editor
    participant App as MoveTask use case
    participant DB as PostgreSQL transaction
    UI->>App: entryId, destination, expectedVersion, commandId
    App->>App: Validate live session and derive ownerId
    App->>DB: BEGIN transaction
    App->>DB: Serialize ownerId and commandId. check request fingerprint
    alt Same command already committed
        DB-->>App: Stored original result
        App->>DB: End replay transaction
        App-->>UI: Original result without duplicate effects
    else Reused key with different request
        App->>DB: ROLLBACK
        App-->>UI: Command conflict. preserve draft
    else New command
        App->>DB: Validate entry and destination ownership and task state
        App->>DB: Update original entry only if version matches
        alt Ownership, state or version check fails
            App->>DB: ROLLBACK
            App-->>UI: Safe validation or version-conflict response
        else Checks pass
            App->>DB: Insert Movement and ChangeRecord
            App->>DB: Store CommandReceipt and result
            App->>DB: COMMIT
            DB-->>App: Committed entry and movement
            App-->>UI: Confirm saved and link origin to destination
        end
    end
    Note over UI,DB: Failure before commit rolls back. lost response after commit is recovered by retrying the same commandId
```

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
