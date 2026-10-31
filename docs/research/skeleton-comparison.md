# Skeleton comparison on a real card

[English](skeleton-comparison.md) · [Русский](skeleton-comparison.ru.md)

Checked 2026-10-31: loadshape 0.2.5, auto-skeleton-react 1.0.5 and
@shimmer-from-structure/react 2.4.6 with core 2.4.6. This is a local integration experiment
and source audit, not a performance benchmark or a universal ranking.

## Finding

Loadshape has concrete differences: it preserves the existing child instance, uses CSS
rather than measuring DOM and drawing a separate skeleton tree, and blocks focus with inert.
In the tested card its text bars follow actual line wrapping. Generating skeletons from real
components already exists in both alternatives. Shimmer also offers responsive remeasurement,
templateProps, a configuration provider and adapters for other frameworks.

## Method

An isolated Vite fixture imports the existing playground ProfileCard, PROFILE data and CSS.
Every library wraps that same card plus an uncontrolled Local draft input. A small enclosing
component records effect mounts/unmounts. Chromium uses agent-browser 0.41.0 and React 19.3.0,
viewport 900 × 1000, without StrictMode. Competitors use downloaded published dist files;
loadshape uses its verified 0.2.5 dist build. No project dependencies or production code changed;
foreign package lifecycle scripts were not executed.

Each library starts on a fresh page. Enter `draft retained`, switch to loading, attempt
programmatic input focus, narrow the container from 375 to 280 px, triple the biography,
add a paragraph, and restore content. Font/image readiness is awaited; each action gets
400 ms for effects/transitions. Library appearance settings stay at defaults. The extra
input is a state probe, not part of the original card.

## Browser observations

| Check                                       | loadshape                | AutoSkeleton                 | Shimmer React               |
| ------------------------------------------- | ------------------------ | ---------------------------- | --------------------------- |
| Live card instances during loading          | 1                        | 2                            | 1                           |
| Total mounts / unmounts after cycle         | 1 / 0                    | 2 / 1                        | 3 / 2                       |
| Draft after cycle                           | `draft retained`         | `draft retained`             | Reset to `initial`          |
| Input focus during loading                  | Blocked                  | Both copies accept it        | Hidden input accepts it     |
| Skeleton after narrowing to 280 px          | Tracks width             | Retains old width, overflows | Tracks width                |
| Longer text and added element while loading | Reflected                | Stale skeleton               | Reflected                   |
| Long biography rendering                    | Bars follow actual lines | Bars from earlier short text | One rectangle for paragraph |
| Uncaught browser errors                     | 0                        | 0                            | 0                           |

All three retained the source card's 375 × 388.875 px dimensions on the first loaded-to-loading
transition. This does not establish overlay accuracy: AutoSkeleton retains content in flow even
when its separate skeleton becomes stale. Its config was stable and default; changing config can
trigger measurement. Focus was tested with element.focus(), not a screen-reader session. CLS,
CPU cost and bundle sizes were not measured.

## Source explanation

Loadshape Root adds data-skeleton and inert to the existing element. Its CSS changes paint,
without a DOM-measurement effect, observer or duplicate child tree. Skeleton animation is enabled
only under prefers-reduced-motion:no-preference; default appearance delay is 150 ms. Consumers
must put aria-busy outside the inert root.
[Root](https://github.com/semyonsurkov/loadshape/blob/9a0afb8c2a0fce242cbfd97d68f7b8bf73e5de53/packages/loadshape/src/skeleton/Root.tsx),
[CSS](https://github.com/semyonsurkov/loadshape/blob/9a0afb8c2a0fce242cbfd97d68f7b8bf73e5de53/packages/loadshape/src/styles.css).

AutoSkeleton mounts a second child tree for requestAnimationFrame measurement, retaining the
original content and generating a separate skeleton tree. Its effect depends on loading/config,
without automatic resize observation. Opacity hides content visually; inert and aria-hidden are
absent. This agrees with the observed extra mount, stale geometry and focus exposure.
[Component](https://github.com/ShanukJ/auto-skeleton/blob/b2fadacd31413670177243fde0c90a42cf4fc6bd/src/AutoSkeleton.tsx),
[renderer](https://github.com/ShanukJ/auto-skeleton/blob/b2fadacd31413670177243fde0c90a42cf4fc6bd/src/skeleton-renderer.tsx).

Shimmer measures one tree with useLayoutEffect/ResizeObserver and draws absolute rectangles.
Loading nests children under extra divs; loaded returns children in a fragment. The experiment
confirmed remounts and draft loss. Its hidden tree has aria-hidden but no inert. This published
version lacks automatic reduced-motion handling; templateProps clones only the first child.
[Adapter](https://github.com/darula-hpp/shimmer-from-structure/blob/64cda5378c304ecf497d58db2f399d3df4968207/packages/react/src/Shimmer.tsx),
[observer](https://github.com/darula-hpp/shimmer-from-structure/blob/64cda5378c304ecf497d58db2f399d3df4968207/packages/core/src/createResizeObserver.ts),
[extractor](https://github.com/darula-hpp/shimmer-from-structure/blob/64cda5378c304ecf497d58db2f399d3df4968207/packages/core/src/extractElementInfo.ts).

Both alternatives populate skeleton geometry after client measurement. Loadshape can send
loading attributes in server HTML for browser CSS painting. This is a source-level distinction;
comparative SSR/hydration was not run, and hydration mismatches are not claimed.

## Limits and choice

All three need renderable placeholder content with representative text/list/media geometry.
Unknown real data can differ, so zero CLS cannot be promised. Loadshape requires modern CSS
(:has(), color-mix(), masks, text decorations), reserved media sizes and styled controls;
Static has mixed-text constraints. SVG icons, backgrounds and borders generally remain visible.
Static inside an inert root is also noninteractive. CSS selectors have browser costs, so the
absence of JS measurement does not establish faster total rendering.
[Loadshape contract](https://github.com/semyonsurkov/loadshape/blob/9a0afb8c2a0fce242cbfd97d68f7b8bf73e5de53/packages/loadshape/README.md).

Choose loadshape for retained child instances/state, actual text-line bars and loading focus
isolation. Consider Shimmer for its configuration API, measured rectangles and framework adapters,
accounting for the tested React lifecycle behavior. AutoSkeleton 1.0.5 needs additional handling
for focus, duplicate effects and changing geometry. None is established as universally better.

A supported description of loadshape is: “CSS skeletons from your existing React component,
keeping its instance mounted and blocking focus while loading.” Speed, bundle-size and broader
compatibility superiority require separate measurements.

## Evidence and reproduction

Local `.scratch/research/skeleton-comparison/` contains versions.json, competitors.md,
fixture.jsx, fixture.css, harness.mjs, probe.mjs, browser-results.json and screenshots.
Run `node .scratch/research/skeleton-comparison/harness.mjs` from the repository root,
replace the experiment port in probe.mjs with the printed URL's port, then run
`node .scratch/research/skeleton-comparison/probe.mjs`. Existing workspace dependencies and
downloaded competitor distributions are required. The owned server and browser were closed.

Scratch artifacts are local and excluded from git/package publication; a standalone public
benchmark was not prepared. Source links pin npm gitHead rather than potentially newer main:
[AutoSkeleton metadata](https://registry.npmjs.org/auto-skeleton-react/1.0.5),
[Shimmer React metadata](https://registry.npmjs.org/@shimmer-from-structure%2freact/2.4.6).
