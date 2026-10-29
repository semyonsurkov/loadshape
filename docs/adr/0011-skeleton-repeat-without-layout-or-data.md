# 0011. Skeleton.Repeat repeats a template without owning layout or data

[English](0011-skeleton-repeat-without-layout-or-data.md) · [Русский](0011-skeleton-repeat-without-layout-or-data.ru.md)

- Status: accepted
- Date: 2026-10-21

## Context

An integrating application's PipelinePlaceholders repeats its real card eight times while loading.
The proposed shared helper removes the need for each consumer to write that wrapper, while
preserving application-owned data as decided in ADR 0004.

## Options

- Keep a local Array.from: smaller public API, but repeated index and key generation for consumers.
- Add Skeleton.List with data and layout: less integration code, but the library would need query
  contracts, list elements, and spacing.
- Add Skeleton.Repeat with count and children: shared repetition while applications retain data,
  loading state, semantic elements, and layout. Selected.

## Decision

Skeleton.Repeat accepts count and children(index), creates a keyed Fragment per position, and
adds no DOM elements, attributes, or styles. Zero never calls children. Negative, fractional,
and non-numeric counts throw RangeError.

Repeat does not enable loading. The application uses Skeleton.Root or a component with its own
Root. aria-busy remains on the application container as in ADR 0005. Real lists use entity keys;
positional keys are appropriate for placeholder slots, not real entity identity.

## Consequences

Consumers can remove their repetition wrapper and retain the actual card. The API works on
React 18 and 19, uses no refs, and is independent of the router adapter. It does not predict
result counts, future statuses, or available actions.
