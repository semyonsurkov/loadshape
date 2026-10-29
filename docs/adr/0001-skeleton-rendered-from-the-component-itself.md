# 0001. Derive the skeleton from the component and placeholder data

[English](0001-skeleton-rendered-from-the-component-itself.md) · [Русский](0001-skeleton-rendered-from-the-component-itself.ru.md)

- Status: accepted
- Date: 2026-10-09
- Decision makers: Semyon Surkov and the project agent
- The usePlaceholder part is superseded by ADR 0004.

## Context

The loading skeleton should share the content's geometry without maintaining placeholder sizes.
Requirements include a CSS appearance delay, surface-aware shimmer, reduced-motion support,
`aria-busy`, and visible request-independent content. Runtime code must not require a browser
automation engine or a heavy library.

## Options

- **boneyard-js 1.10.0, a Playwright DOM snapshot stored as JSON:** precise geometry and a measured
  3.7 KB gzip bundle including two block snapshots. It requires browser capture after layout edits,
  detects dark mode only through `.dark`, and calculates colors in JavaScript, so CSS token values
  through `var()` do not work. It lacks appearance delay and reduced-motion handling, paints a
  multiline paragraph as one block, hides card borders, and lists Playwright as a dependency.
  Evaluated with Vite 8 and React 19.
- **react-loading-skeleton 3.5.0 and similar primitives:** straightforward and predictable, but
  manually composed skeleton dimensions can drift when the component changes.
- **A separate skeleton component written beside the real one:** a familiar pattern in Primer,
  Atlassian, and Fluent, but duplicates the layout and can drift for the same reason.
- **Radix Themes 3.3.0 Skeleton:** uses hidden content, element painting, and
  `box-decoration-break: clone` for lines. It is coupled to Radix Themes, wraps each leaf,
  pulses instead of shimmering, and has no appearance delay.
- **Base UI 1.9.0:** had no Skeleton component at the time of this decision.
- **The actual component with placeholder data, whose leaves are painted by CSS:** shares one
  layout and needs only CSS plus a small React layer. Placeholders must have representative lengths;
  unexpectedly longer response text can still wrap differently.

## Decision

Use `Skeleton.Root` to switch a rendered subtree into loading paint, `Skeleton.Static` to preserve
known content, and placeholder data for the component. The initial plan included `usePlaceholder`;
ADR 0004 replaces it with application-owned data selection. One rendered tree supplies both states.

## Consequences

Integrations provide typed placeholder data and Root/Static markers without a separate skeleton
layout. Media must reserve dimensions or `aspect-ratio`. At this decision's date, painting individual
text lines without changing markup still required investigation in roadmap stage 2. If this proved
impossible, full-width lines without a shorter final line would require another ADR.
