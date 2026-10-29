# Testing

[English](testing.md) · [Русский](testing.ru.md)

The permanent suite covers four levels. The library makes no HTTP requests, so it uses no MSW.
Browser Mode covers real-browser behavior without a separate E2E application.

## Levels

| Level                | Coverage                                                                    | Tool                                                 |
| -------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------- |
| Static types         | Public props, refs, React 18/19 compatibility                               | tsc --noEmit                                         |
| Unit and integration | Exports, component states, prop merging, handlers, refs, TanStack adapter   | Vitest, jsdom, Testing Library                       |
| SSR                  | inert serialization, state attributes, Spinner labels, React warnings       | react-dom/server                                     |
| Browser              | Real inert/focus, geometry at 375/768/1440 px, Static visibility, hydration | Vitest Browser Mode, Playwright, Chromium and WebKit |

Unit/integration files sit beside source as `*.test.tsx`. SSR uses `*.ssr.test.tsx` and browser
checks use `*.browser.test.tsx`; Vitest projects are separated by these patterns.

Browser checks exercise behavior jsdom cannot reproduce: inert prevents focus, loading preserves
child coordinates, Static stays visible, and server markup hydrates without mismatches. Geometry
containers use viewport width minus padding, so text wraps differently at each tested width.
Palette, spacing, and animation timings are outside these checks. Computed text opacity is read
to verify Static visibility.

## Commands

```sh
pnpm --filter loadshape test
pnpm --filter loadshape test:browser
pnpm --filter loadshape test:all
pnpm --filter loadshape typecheck
```

The first browser run needs installed browsers:

```sh
pnpm --filter loadshape exec playwright install chromium webkit
```

## React matrix

Local checks use React 19 from devDependencies. `.github/workflows/ci.yml` runs oxlint, Prettier,
library typecheck, unit/SSR/browser tests, and the library build on React 19.3.0 and React 18.3.1
with matching type packages. The React 18 job installs its version separately, avoiding npm aliases
and mixed React versions within a process.

Workspace checks and the playground build run only in the React 19 job. The playground resolves
library source through the source condition; adding the library's React 18 next to its React 19
would introduce two versions into that build.

Local React 18 checks use a separate repository copy with overrides for react/react-dom 18.3.1,
@types/react 18.3.31, and @types/react-dom 18.3.7, preserving the working package.json.

One test checks the cleanup returned by a React 19 callback ref. React 18 lacks that mechanism,
so test.runIf skips it in that matrix job; the shared null-callback test covers React 18 cleanup.
All other tests run for both versions.
