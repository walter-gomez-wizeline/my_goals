# ADR-004 — General goal-tracking model

Date: 2026-10-26. Status: general scope confirmed by the user; technical design proposed.

## Context

Versions 0.2 and 0.3 specialized the model for gym use. The user clarified that this was illustrative and requested other structures: meals/calories and weight measurements; courses toward a certification.

## Decision

Separate goals, activities with subtasks, structured records, and indicators. Goals combine these capabilities without inheriting a gym structure. Unit, target, period, and formula belong to each indicator rather than the entire goal.

Support four indicator strategies: sum, completed-task count, latest observation with series, and milestone-set progress. Use typed fields and a fixed strategy set; do not build a programming language or separate physical tables per goal.

## Consequences

Remove SessionDetails and automatic attendance Measurement creation from the core. Illustrative attendance is calculated by counting selected completed tasks. Logging meals does not complete tasks; weight observations are not summed; completing courses does not establish certification.

Configuration and validation work increases. Limit the MVP to one subtask level, concrete field types, and four strategies. Version definitions to preserve historical meaning.

This decision replaces gym-specific constraints in earlier RF-01, RF-03, RF-08, and RF-09. It does not affect responsive web, shared accounts, or privacy. No application or production data needs migration. ADR-005 subsequently makes the journal/collections the core and goal association optional.
