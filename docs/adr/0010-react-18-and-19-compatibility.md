# 0010. Support React 18 and 19 in one package

[English](0010-react-18-and-19-compatibility.md) · [Русский](0010-react-18-and-19-compatibility.ru.md)

- Status: accepted
- Date: 2026-10-20

## Context

An integrating application uses React 18. The CSS mechanism is independent of React versions,
but ref props, callback-ref cleanup, and inert serialization differ between React 18 and 19.

## Decision

Support React ^18.0.0 || ^19.0.0 in one package. Public components and the router adapter use
forwardRef. A shared utility selects ref access by React major version and memoizes the merged
callback. React 18 releases refs by calling them with null; React 19 can use the returned cleanup.
Previous cleanup runs before a replacement attachment.

React 18 receives an empty-string inert prop; React 19 receives boolean true. Both produce the
same HTML attribute. Finishing loading removes it.

## Alternatives

A fork increases synchronization cost. Widening peerDependencies without adapting refs and inert
leaves warnings and breaks the loading contract.

## Consequences

The public API and CSS remain unchanged. Custom render components under React 18 must forward
refs with forwardRef. The playground stays on React 19; both supported versions require checks.
