# Contributing

## Start with a bounded reading packet

Read [PROJECT_STATUS.md](PROJECT_STATUS.md), select one ready task in the [backlog](specs/15-first-flow-backlog.md), and read the specs/ADRs relevant to it. You do not need the entire repository or chat history. Agents additionally follow [AGENTS.md](AGENTS.md); humans do not need Codex or custom agents to contribute.

| Work | Targeted context |
| --- | --- |
| Toolchain/local setup, TASK-003 | Status, backlog row, ADR-003, technical contracts |
| Persistence/schema, TASK-004 | Technical contracts, domain, ADR-006; referenced AC criteria |
| Authentication, TASK-005 | ADR-006, technical contracts section 1, FS-01/11/12 and relevant AC criteria |
| Screens and capture, TASK-006/007 | First-flow spec, screen spec sections for the assigned screen, storyboard, relevant endpoint contracts |
| Collections/task state, TASK-008–010 | First-flow scenarios, technical contracts, ADR-006 for state; only relevant domain sections |
| Integration/QA, TASK-011/012 | Assigned FS scenarios and AC criteria, technical contracts and current implementation diff |
| Hosting/recovery, TASK-013/014 | ADR-003, cloud verification checklist, technical operational gates, RNF-07/AC-75 |

Expand reading only if a reference or contradiction requires it. The [README](README.md) is the full index, not mandatory sequential reading.

## Current setup reality

There is no application package, lockfile, schema implementation, CI workflow or runnable test suite yet. Do not run guessed install/test/dev commands or assume a framework version. TASK-003 establishes those and must replace this section with exact supported prerequisites, environment-variable names, install/start/migrate/test commands and expected outcomes once verified.

Available now: Markdown specifications, Mermaid source, agent TOML definitions and a static HTML storyboard. Open [the storyboard](specs/wireframes/first-flow.html) in a browser; controls are wireframe notation and do not persist data. Use a Mermaid-capable viewer for diagrams. No secret or cloud account is needed to read/design.

Git inspection from the repository root:

```sh
git status --short
git log -5 --oneline
git diff --check
```

These inspect changes/history/whitespace; they are not application tests. Do not depend on previous contributors' `/tmp` validation scripts.

## Spec-driven workflow

1. Choose a ready task and identify intended outcome, dependencies, allowed files and relevant RF/RNF/AC/FS/ADR references. If someone is already working on shared files, coordinate before editing.
2. Distinguish confirmed choices, design baseline and remaining proposals. User direction takes precedence. For a behavior change, update affected specs/criteria and add/update an ADR if consequential **before** implementing the new behavior.
3. Work in a focused branch when using a shared repository. No branch naming convention is currently required. Preserve unrelated local changes; do not reset another contributor's work.
4. Deliver the smallest coherent flow or decision. Keep journal capture usable without optional tracking. Do not silently drop errors, history, authorization or accessibility to accelerate the demo.
5. Run checks appropriate to the change and record exact commands, environment and outcomes. For code, use the established tooling once available; add meaningful regression checks. Mark unavailable/unexecuted checks honestly.
6. Update the backlog row with evidence, dependencies and state. Update PROJECT_STATUS.md with the next ready task and open gates. Update setup instructions when tooling changes.
7. Review the diff, stage intended files and create an English commit explaining the change. Push/PR workflow depends on the repository's actual remote setup; no remote or CI gate is assumed here.

## Validation by change type

- Documentation: verify local links, referenced IDs, terminology, scope and cross-document consistency; parse changed Mermaid blocks with a real parser. Record the parser/version. Visual review is separate from syntax validation.
- Wireframes: inspect mobile/desktop layouts and state coverage; distinguish a static prototype from working UI or a usability study.
- Code (when present): verify relevant acceptance scenarios and unit/integration behavior. Persistence tests require real isolated PostgreSQL; local SQL tests alone do not prove hosted identity configuration.
- Authentication/security: test two accounts and distinct device sessions, known foreign IDs, replay, expiry/revocation, private-cache/draft cleanup, owner context reuse and CSRF when applicable.
- Operations: validate environment separation and migrations; exercise restore before making recovery claims. User export/import is not an operational backup.

## Completion and handoff

A task is done only when its applicable deliverable and verification evidence exist. “Specified,” “implemented” and “verified” are different states. TASK-001/002 design completion does not mark any runtime behavior passed. Blocked tasks name the actual missing decision/dependency rather than a vague lack of context.

Use this brief structure in a task note or PR description (no new permanent handoff file per task is required):

```text
Task: TASK-...
Outcome and scope:
Changed files:
Requirements/criteria covered:
Checks executed and results:
Not tested / limitations:
Decisions or remaining gates:
Next ready task and minimum reading packet:
```

Update status/backlog in the same change. In PROJECT_STATUS.md, label a commit hash as the last verified baseline rather than attempting a self-referential current-commit hash. Dates use the project's client timezone when relevant; git is authoritative for current revision and dirty state.

## Collaboration and boundaries

Focus coordinates scope, specialist choice and final integration. Planner maintains task/dependency/status accuracy. UI/UX, architect, developer and QA provide their own specialty; creating agents is not necessary for human development. Avoid competing backlogs or parallel edits to shared specs without an owner.

Project documentation, identifiers and interface copy are English. User content is not automatically translated. Use synthetic fixtures only; never commit credentials, session secrets, provider tokens, personal journal content or environment secrets. Local/test and hosted-demo identities/data must stay separate. Purchases, provisioning, deployment and production-data mutations require their own authorization; a ready task is not that authorization.
