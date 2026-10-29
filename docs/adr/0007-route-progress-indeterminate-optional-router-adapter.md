# 0007. Indeterminate RouteProgress with a separate router adapter

[English](0007-route-progress-indeterminate-optional-router-adapter.md) · [Русский](0007-route-progress-indeterminate-optional-router-adapter.ru.md)

- Status: accepted
- Date: 2026-10-09
- Decision makers: Semyon Surkov and the project agent during roadmap stage 5

## Context

A router knows whether navigation is pending, but not its percentage. An indicator should share
the appearance delay, work with different routers, and keep the core entry independent of TanStack.

## Options

- A timer-driven bar growing to 90% implies a measured percentage and needs JavaScript timers.
  Rejected because that measurement is unavailable.
- A moving CSS segment conveys activity; reduced motion can replace movement with a static bar.
  Selected for the general component.
- TanStack Router in the core entry forces a router dependency even for Skeleton alone. Rejected.
- A separate `loadshape/tanstack-router` adapter with an optional peer reads RouterProvider
  context and delegates to the general component. Selected following ADR 0002's module boundary.

## Decision

The core RouteProgress accepts required boolean pending, render, className, ref, and HTML
attributes. It defaults to div and remains mounted. It sets `data-route-progress="pending"`
while busy and an empty data-route-progress attribute otherwise. It is decorative through
aria-hidden=true; applications supply accessible status.

It inherits currentColor; applications own position and width. Defaults are
--route_progress_thickness 0.125em, --route_progress_duration 1.4s, and
--route_progress_delay falling back to --loadshape_delay (150 ms). CSS moves a ::before segment
with transform. Completion and cancellation hide it immediately. Reduced motion retains the
appearance delay and uses a stationary bar.

The adapter exports RouteProgress and RouteProgressProps from `loadshape/tanstack-router`.
It accepts the same props except pending, derived with useRouterState from
`state.status === 'pending'`. TanStack Router is an optional peer at ^1.170.41;
core code and types contain no router imports.

## Consequences

Consumers import `loadshape/styles.css` and style position, width, and color. Without fixed or
absolute positioning the hidden component reserves its height. The adapter requires TanStack
Router and placement inside RouterProvider; other routers pass pending to the general component.
