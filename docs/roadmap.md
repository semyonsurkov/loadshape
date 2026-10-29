# First-version roadmap

[English](roadmap.md) · [Русский](roadmap.ru.md)

Stages are sequential, with at most one active. Propose further work through GitHub Issues.

## Current

No stage is active. The first public version is released; the next stage has not been selected.

## Completed

### 7. First publication

loadshape 0.2.0 was published on 2026-10-21 with React 18/19 support and Skeleton.Repeat.
Installation through pnpm add loadshape passed in two clean React applications. Skill installation
through npx skills add was checked during release preparation. See the package changelog.

### 6. Integration skill

Agents without previous integration context connected Skeleton to the playground and a real
React application without manual fixes. Checks and limitations are recorded in [skill verification](skill.md).

### 5. RouteProgress

A general indicator and `loadshape/tanstack-router` adapter. Acceptance: slow playground navigation
shows progress while fast navigation does not flash.

### 4. Spinner and shared delay

Acceptance: Spinner inherits surrounding size/color, and neither it nor Skeleton appears on a
load shorter than 150 ms, demonstrated in the playground.

### 3. Skeleton API

Root/Static expose render, className, an inert loading root, and application-owned aria-busy
(ADR 0005). Placeholder data comes from TanStack Query placeholderData or data ?? PLACEHOLDER
(ADR 0004). Acceptance: integrate into a real page, replacing its manual skeleton and marking
known content with Static.

### 2. Skeleton mechanism

Acceptance: list, card, and page stands preserve element coordinates when toggling loading;
text receives line-sized bones without component markup changes; dark mode and reduced motion
work. A background stand demonstrates page, card, dark, and colored surfaces, with real container
backgrounds/borders and inherited bone colors.

### 1. Workspace

Acceptance: pnpm dev opens the playground; pnpm build emits the library's ESM, types, and styles.css.
