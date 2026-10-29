# 0005. Root is inert; the application container owns aria-busy

[English](0005-aria-busy-on-project-container-root-inert.md) · [Русский](0005-aria-busy-on-project-container-root-inert.ru.md)

- Status: accepted
- Date: 2026-10-09
- Decision makers: Semyon Surkov and the project agent following stage 3 review

## Context

Loading placeholders must be unavailable to keyboard focus and screen readers, while their
container reports loading through aria-busy. Putting inert and aria-busy on the same Root removes
that element and its attributes from the accessibility tree, so the busy signal is lost.

## Options

- **Both attributes on Root:** concise, but the region simply disappears for screen readers.
- **An outer busy element and inner inert element:** handles both attributes, but adds a wrapper
  that can change grids, flex layouts, and tables.
- **aria-hidden without inert:** leaves placeholder links and buttons focusable and also hides
  the busy signal.
- **inert on Root and aria-busy on an existing application container:** preserves markup,
  though the integration must supply the outer attribute.

## Decision

Root receives inert; the existing surrounding application container receives `aria-busy={loading}`.
This preserves the component layout without introducing another element.

## Consequences

The integration skill must put aria-busy outside Root and verify loading controls cannot receive
focus. Visually static descendants inside Root remain inert, so interactive controls that should
stay available must live outside it.
