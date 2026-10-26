# Focus and project specialists

The standalone TOML files define six reusable project-scoped Codex agents: one orchestrator and five specialists.

- `focus` (Focus): lead orchestrator for task routing, coordination, integration, and consolidated results.
- `planner`: senior Technical Project Manager for delivery planning, traceable tasks, priorities, dependencies and estimates.
- `qa`: senior QA and independent verification.
- `developer`: senior software implementation and fixes.
- `architect`: senior architecture and domain design.
- `uiux`: senior UI/UX design for screens, navigation, journeys, interactions, visual system, and accessibility.

They inherit the parent session's model, reasoning effort, and permissions; no model or permission override is configured. The role boundaries are instructions, not separate filesystem sandboxes.

## Primary role

AGENTS.md instructs the primary agent to act as Focus and select specialists when useful. The named `focus` definition can also be invoked explicitly. Creating its file does not change the app's runtime entrypoint or force a particular model. Do not spawn a second Focus merely to coordinate work the primary agent can already route. Specialists cannot recursively delegate; Focus respects available runtime limits.

## Example requests

- “Focus, use planner to turn the MVP specs into ordered increments and actionable tasks, with dependencies and acceptance references.”
- “Use planner to update task status from actual implementation and QA evidence, and identify the next ready task.”

- “Focus, define the next MVP step and use only the specialists needed.”
- “Focus, coordinate screen design, implementation feasibility, and QA criteria, then consolidate the spec.”
- “Use the UI/UX agent to define the first demo screens, navigation, mobile/desktop behavior, and empty/error/loading states.”
- “Have UI/UX propose the daily-log wireframe, developer review feasibility, architect check data/access implications, and QA review acceptance coverage.”

- “Use the architect agent to review the journal-first domain model and propose the next ADR.”
- “Use the developer agent to implement the agreed daily-log flow against its acceptance criteria.”
- “Use the QA agent to verify this change and report passed, failed, and unexecuted criteria.”
- “Have architect and QA independently review the specs, then consolidate their findings before implementation.”

The primary agent uses AGENTS.md for coordination and SDD rules. Definitions configure roles; they do not start background work automatically. Open a session in this project so project-scoped configuration is available. If an already-open client does not expose the new roles, start a fresh project session and check availability; runtime discovery has not been verified by the configuration-only checks.

Official format reference: [OpenAI Docs: custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents).
