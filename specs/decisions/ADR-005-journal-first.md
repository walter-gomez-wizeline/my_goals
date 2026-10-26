# ADR-005 — Journal and collections as the core

Date: 2026-10-26. Status: product direction specified by the user; interaction details proposed.

## Context

The user requests Bullet Journal characteristics and generality for capturing different things and gaining perspective. Version 0.4 still organized records/indicators around a mandatory goal.

## Decision

Journal, entries, and collections are the foundation. Index and daily/monthly/future views support finding and planning; reflection and migration support intentional review. An entry may exist without a collection or goal.

Record types and indicators belong to collections. Their relationship to goals is optional. Goals, subtasks, in-progress state, and calculations extend the journal without blocking its use.

## Consequences

Reorder delivery to begin with rapid logging, organization, and review. Separate free reflection from pending-item review. Allow multiple thematic links without duplicating entries. Retain identity/history during migration.

This complements ADR-004 and replaces its mandatory goal association for record types and indicators. Shared account and web-platform decisions remain unchanged. The first delivery covers the base method; structured capabilities remain planned for later increments.
