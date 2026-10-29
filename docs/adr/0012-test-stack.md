# 0012. Vitest, Testing Library, and Playwright Browser Mode

[English](0012-test-stack.md) · [Русский](0012-test-stack.ru.md)

- Status: accepted
- Date: 2026-10-21
- Decision makers: Semyon Surkov and the project agent after adding React 18 support

## Context

Before 0.1.0, checks used temporary browser scripts and clean consumers outside the repository.
React 18, SSR, inert, focus, and geometry checks were manual, so regressions could survive until
release. The library has no HTTP requests or independent end-user application.

Four levels are needed: public types, component behavior, server markup, and a real browser.
jsdom cannot reliably check inert or geometry, and typechecking alone cannot verify React 18.

## Options

- **Jest and Testing Library:** familiar, but ESM/TypeScript require extra setup while Vite is
  already in the workspace.
- **Only Playwright Test:** one real-browser tool, but slower component tests and separate SSR
  and type checks remain necessary.
- **Only Vitest and jsdom:** fast, but the key inert, focus, and geometry invariants stay unchecked.
- **Vitest Browser Mode with Playwright:** the same runner and configuration for unit and real
  Chromium/WebKit checks, with browser installation and slower execution.
- **React 18 through npm aliases in one install:** convenient, but Testing Library's CommonJS
  require('react-dom/client') bypasses Vite aliases and mixes React 18 with React DOM 19.
- **A separate React 18 CI job:** one React per run, matching a consumer, at the cost of matrix
  setup and another install. Selected.
- **MSW:** inapplicable because the library makes no requests.

## Decision

Use Vitest 4, jsdom, and @testing-library/react for unit and integration tests. SSR uses
react-dom/server and checks React warnings. Browser Mode with the Playwright provider runs in
Chromium and WebKit, covering inert/focus, geometry at 375/768/1440 px, Static visibility,
and server hydration. Visual snapshots are not used.

GitHub Actions runs a React 18/19 matrix. The React 18 job installs matching react, react-dom,
@types/react, and @types/react-dom versions before checks. The primary local run uses React 19
from devDependencies. This matches consumers without aliases bypassed by the CJS loader.

No MSW or separate E2E application is added. Browser tests already exercise the real DOM.

## Consequences

Dev dependencies include Vitest, Playwright, Testing Library, jsdom, Vite, and its React plugin.
Install browsers with `pnpm --filter loadshape exec playwright install chromium webkit`;
CI installs system dependencies from the package declaring Playwright. Tests sit beside source,
so missing component coverage is visible. Commands and levels are described in docs/testing.md.

The React 18 matrix job temporarily modifies package.json without committing those changes.
Local React 18 checks run in a separate copy to preserve the working lockfile.
