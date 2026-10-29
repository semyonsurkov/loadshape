# 0006. Spinner uses a CSS ring and a shared appearance delay

[English](0006-spinner-css-ring-shared-delay.md) · [Русский](0006-spinner-css-ring-shared-delay.ru.md)

- Status: accepted
- Date: 2026-10-09
- Decision makers: Semyon Surkov and the project agent during roadmap stage 4

## Context

Inline buttons, status text, and unstructured regions need an activity indicator. It should avoid
flashing on short loads, inherit appearance, and provide predictable accessibility and reduced
motion behavior. Its names become a public contract.

## Options

- **SVG with animated stroke-dashoffset:** a smooth varying arc, but requires SVG markup and
  size/thickness props rather than inheriting the surrounding font.
- **A CSS border ring with an opaque top border:** uses 1em and currentColor with no extra ring
  markup, but has a fixed arc length.
- **Independent component delays:** flexible but duplicates application configuration.
- **Shared --loadshape_delay with per-component overrides:** one application default plus local
  customization, with another public variable.
- **Stopping rotation under reduced motion:** consistent with skeleton shimmer, but a stationary
  ring communicates activity less clearly.

## Decision

Spinner defaults to span or uses render, marks data-spinner, and draws a CSS ring. Defaults are
--spinner_size 1em, --spinner_thickness 0.125em, and --spinner_duration 0.8s. The delay reads
--spinner_delay, then --loadshape_delay (150 ms), which Skeleton also uses. Without label it is
aria-hidden; with label it receives role=status and visually hidden data-spinner-label text,
since a live region announces content rather than an aria-label. It animates rotate instead of
transform to preserve application translation. Reduced motion slows rotation threefold.

## Consequences

Spinner's CSS uses ordinary priority because applications can style this library-owned element.
Replacing an equally sized 1em icon preserves button width. Adding a spinner beside text requires
an application-reserved slot. A live region mounted with its initial label may not announce;
the label still supplies text when navigating the accessibility tree.
