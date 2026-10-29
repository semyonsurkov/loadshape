---
name: loadshape
description: 'Integrate loadshape loading states into React 18 and 19 applications: component-derived skeletons, inline spinners, and route progress. Use for requests to add a skeleton or скелетон with loadshape, replace a separate loading layout, connect Spinner, or integrate RouteProgress with TanStack Router. Preserve the application layout and visual tokens.'
license: MIT
---

# loadshape

[English](SKILL.md) · [Русский](https://github.com/semyonsurkov/loadshape/blob/main/skills/loadshape/SKILL.ru.md)

Build a loading state from the component that will display the real data. Preserve its layout,
feed it realistic placeholder data, and let loadshape paint the rendered leaves.

## Inspect the integration

Read the target component, its data types, query or loader, error and empty branches, and styles.
Check the installed React and loadshape versions and package scripts. loadshape requires React 18 or 19;
use the application's package manager and styling conventions. Import `loadshape/styles.css`
once at the application entry. Its `@layer loadshape` keeps project styles in control.

Choose the branch that matches the request:

- Skeleton for a list, card, table, or page: read [references/skeleton.md](references/skeleton.md).
- Spinner for an inline operation or RouteProgress for navigation: read
  [references/indicators.md](references/indicators.md).

Install loadshape from npm if available. When evaluating an unpublished local build, use the
provided tarball or workspace dependency; do not invent a published version or a repository URL.

## Implement the selected state

Keep one content tree for loaded and loading states. Replace the existing manual skeleton branch
with the real component receiving placeholder data. Preserve error, empty, disabled-query, and
background-refresh behavior; cached real data can stay visible during a refetch.

Place `aria-busy` on the application's container around Skeleton.Root. The loading root is inert,
which also removes it from the accessibility tree. Use Skeleton.Static for content known without
the request, such as a heading or table header. Apply it to the existing element with `render`
where another wrapper would affect layout or HTML validity.

Use the existing project tokens. loadshape has no theme to install and needs no separate
hand-sized placeholder layout. Placeholder text is sized for typical line counts and wrapping;
identical text length is not a guarantee of identical width in a proportional font.

## Verify the result

Run the target application's existing typecheck, lint, and build commands. Inspect loading and
loaded states in the browser at mobile and desktop widths. Compare element coordinates when
geometry is part of acceptance; inspect a representative long item as well as a short one.

Check that a load shorter than the configured delay does not flash, known content stays visible,
loading controls are unavailable through inert, error and empty states still render, and
reduced-motion works. Report the exact commands and browser checks completed; identify any
unverified criterion. The result is complete when the intended loading state works without
altering the target component's geometry or its existing data-state behavior.
