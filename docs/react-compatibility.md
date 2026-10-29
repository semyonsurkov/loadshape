# React 18 and 19 compatibility

[English](react-compatibility.md) · [Русский](react-compatibility.ru.md)

## Scope

React 18 support was added to the existing package without changing CSS or user-facing props.
See [ADR 0010](adr/0010-react-18-and-19-compatibility.md) for the decision and alternatives.
The compatibility change itself excluded npm publication and application rollout.

## Acceptance criteria

- Skeleton.Root, Skeleton.Static, Spinner, RouteProgress, and the router adapter forward refs.
- The DOM root receives inert while loading and loses the attribute afterward.
- Object refs clear on unmount; callback cleanup runs exactly once per attachment, including
  React 19's StrictMode cycle.
- Changing loading or a Spinner label does not reconnect unchanged refs.
- The core import keeps React as its sole runtime peer dependency.

## Original verification

Workspace typecheck, lint, and build passed on pinned dependencies. A Corepack download error
required invoking the same pnpm 12.10.1 through npm exec.

A temporary external browser stand used React 18.3.1 from an integrating application and React
19.3.0 from the playground. Object refs in all four core components referenced their DOM elements
and became null on unmount. Render-element refs and forwarded refs worked together. Callback
cleanup ran on unmount; React 19 also passed StrictMode checks. Rerenders kept unchanged callbacks
attached. Root had inert only while loading. React 18 geometry matched across the toggle at
992 × 90.5 px. Spinner switched from decorative to role=status.

A separate TypeScript consumer with @types/react 18.3.28 compiled the published declarations for
all core components and a custom forwardRef render. There were no React console warnings;
the only console error was a missing favicon.

This particular change did not run the TanStack adapter in a browser or WebKit. The adapter
passed typecheck and build with the playground. For the permanent React 18/19 matrix, see
[testing](testing.md).
