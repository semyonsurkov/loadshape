# 0004. Placeholder data belongs to the query or application

[English](0004-placeholder-data-from-query-not-library-hook.md) · [Русский](0004-placeholder-data-from-query-not-library-hook.ru.md)

- Status: accepted
- Date: 2026-10-09
- Decision makers: Semyon Surkov and the project agent during roadmap stage 3
- Supersedes the usePlaceholder part of ADR 0001.

## Context

The real component needs correctly typed placeholder data while loading. The initial plan proposed
`usePlaceholder(data, placeholder)`. A stale response must not remove the skeleton for a newer query.

## Options

- **Library usePlaceholder:** mostly `data ?? placeholder`; it knows neither the query identity
  nor the generation, so it cannot reject stale responses.
- **TanStack Query placeholderData and isPlaceholderData:** Query already binds state to the key,
  so an old response cannot complete a new query. Applications without Query need their own fallback.
- **A library wrapper around useQuery:** hides the wiring but introduces a Query dependency
  and another API over an existing one.

## Decision

Use `placeholderData` and `isPlaceholderData` for Skeleton.Root loading. Without Query, use
`data ?? PLACEHOLDER` and the same request's loading signal. Export no placeholder hook.
The render prop accepts an element, not a state callback: the current two-state contract does not
need a callback. The default Static wrapper's data-skeleton-contents marker is internal,
as is --_skeleton_paint in ADR 0003.

## Consequences

Query owns request generations. The integration skill must derive loading and data from the same
request. Placeholders depending on another query, such as lookup labels, belong in the page's
hook rather than a fixed placeholderData value. A future render callback would need a new ADR.
