# loadshape

[English](https://github.com/semyonsurkov/loadshape/blob/main/packages/loadshape/README.md) · [Русский](https://github.com/semyonsurkov/loadshape/blob/main/packages/loadshape/README.ru.md)

Loading states for React 18 and 19 that use the component layout and application visual tokens.
Skeleton paints the rendered content, Spinner inherits its size and color, and RouteProgress
indicates navigation without inventing a percentage.

![A list switching between skeleton loading and rendered content](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton.gif)

The recording uses the same fixture data in both states to show the rendered geometry.
Representative placeholder lengths and reserved image dimensions help preserve geometry; loadshape
cannot predict the response content.

[Loading screenshot](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton-loading.png) ·
[Content screenshot](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton-content.png) ·
[Playground and source](https://github.com/semyonsurkov/loadshape#playground)

## Install

Requires React 18 or 19.

```sh
pnpm add loadshape
```

CSS is imported once at the application entry:

```tsx
import 'loadshape/styles.css';
```

Styles live in `@layer loadshape`. There is no theme or runtime stylesheet injection.
The core entry depends only on React; using it does not require TanStack Router.

## Skeleton

The same component renders in both states, with representative placeholder data during loading:

```tsx
import { Skeleton } from 'loadshape';

type Post = { id: string; title: string; excerpt: string };

const PLACEHOLDER_POSTS: Post[] = [
  { id: 'placeholder-1', title: 'A typical article title', excerpt: 'A representative summary.' },
  { id: 'placeholder-2', title: 'Another article title', excerpt: 'A slightly longer summary.' },
];

export function PostList({ data, loading }: { data?: Post[]; loading: boolean }) {
  const posts = data ?? PLACEHOLDER_POSTS;

  return (
    <section aria-busy={loading || undefined}>
      <Skeleton.Root loading={loading}>
        <Skeleton.Static render={<h2 />}>Recent posts</Skeleton.Static>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </Skeleton.Root>
    </section>
  );
}
```

The application retains its existing error and empty branches. Placeholder values must satisfy
the real types and formatters, including dates and enums. With TanStack Query, placeholderData
provides the initial values and isPlaceholderData supplies loading: placeholder data puts the query
in success, so isPending is false. Cached real data can remain visible during background refresh;
disabled queries retain their existing behavior.

### Repeated placeholders

`Skeleton.Repeat` repeats a render function without adding a DOM wrapper:

```tsx
const PLACEHOLDER_COUNT = 8;
const PLACEHOLDER_POST = {
  title: 'A representative article title',
  excerpt: 'A typical summary with realistic length.',
};

<section aria-busy={loading || undefined}>
  <Skeleton.Root loading={loading} render={<ul className={styles.list} />}>
    {loading ? (
      <Skeleton.Repeat count={PLACEHOLDER_COUNT}>
        {(index) => (
          <li>
            <PostCard post={PLACEHOLDER_POST} position={index + 1} />
          </li>
        )}
      </Skeleton.Repeat>
    ) : (
      posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))
    )}
  </Skeleton.Root>
</section>;
```

`count` is a required non-negative safe integer. Zero renders nothing and does not call
`children`; invalid counts throw `RangeError`. `children(index)` receives a zero-based index.
Repeat supplies stable positional keys, so the returned placeholder needs no key.
Real data uses entity keys in the normal map.

Repeat does not enable skeleton loading, choose data, create list elements, set `aria-busy`,
or apply layout and spacing. These remain application responsibilities. If the repeated component
already contains `Skeleton.Root`, its loading prop controls the state without another Root.

### Root and Static

| Component         | Props                                                                               | Default element                 |
| ----------------- | ----------------------------------------------------------------------------------- | ------------------------------- |
| `Skeleton.Root`   | Required `loading: boolean`, `render`, HTML attributes, `className`, `style`, `ref` | `div`                           |
| `Skeleton.Static` | `render`, HTML attributes, `className`, `style`, `ref`                              | `span` with `display: contents` |

The render prop applies the mechanism to an existing element:

```tsx
<Skeleton.Root loading={loading} render={<table className={styles.table} />}>
  <Skeleton.Static render={<thead />}>
    <tr>
      <th>Name</th>
      <th>Total</th>
    </tr>
  </Skeleton.Static>
  <tbody>{rows}</tbody>
</Skeleton.Root>
```

Tables, lists, and select require valid child elements; the default span is not valid there.
Custom components passed through render must forward HTML attributes and ref to their DOM root.
React 18 requires forwardRef; React 19 also supports ref as a prop. Static preserves its whole
subtree, which should contain only content known without the request. Dynamic values beside static
labels need their own elements. A static element at any depth disables its text block's lines,
because an ancestor's underline would cross it; Static belongs directly inside the block, with
dynamic values in separate elements.

Root becomes inert while loading. The application's container outside Root carries aria-busy,
since inert removes Root and its descendants from focus and the accessibility tree. Controls
that remain usable, such as cancellation, belong outside Root even if they are visually static.

### Skeleton recordings

The profile card reserves its cover and avatar dimensions in the component's CSS:

![A profile card switching from skeleton loading to rendered content](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton-card.gif)

A page can keep navigation outside Root and preserve a known feed heading with Static:

![A profile sidebar and feed switching from skeleton loading to content with static navigation and heading](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton-page.gif)

These playground recordings use the same fixture data in both states.

### Attributes

| Attribute                 | Meaning                                              |
| ------------------------- | ---------------------------------------------------- |
| `data-skeleton="loading"` | Enables the loading paint on Root                    |
| `data-skeleton-static`    | Preserves a request-independent subtree              |
| `data-skeleton-bone`      | Makes an intentionally empty element a bone          |
| `data-skeleton-contents`  | Gives the default Static wrapper `display: contents` |

Skeleton paints text lines, media, and controls. Container backgrounds, borders, spacing, and SVG
icons remain visible. It preserves the rendered tree's geometry; it cannot predict unknown text
length or the number of rows in a response.

Images require reserved dimensions or aspect-ratio in the component. Inputs, selects, and buttons
require application styling: painting an unstyled native control can change its size in WebKit. A chart
whose content is entirely SVG needs an application-owned loading representation.

## Surfaces

Skeleton uses the surrounding text color while preserving container backgrounds and borders.
The same component works on light, dark, and colored surfaces with application tokens.

![Skeleton loading on a page, a card, a dark section, and a colored banner](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/surfaces.png)

## Spinner

```tsx
import { Spinner } from 'loadshape';

<Spinner />;
<Spinner label="Loading the report" />;
```

Spinner defaults to span and accepts label, render, HTML attributes, className, style, and a forwarded
ref. Its ring is 1em and currentColor; a reserved slot or an equally sized replaced icon preserves
layout. It appears after the shared delay and slows rotation threefold under reduced-motion.

Without label it is decorative (`aria-hidden`). With label it has role=status and a visually
hidden text child. Mounting a live region with its initial text does not guarantee an announcement;
a status region can remain mounted before its text changes when an announcement is required.

## RouteProgress

The general component accepts any router or navigation loading signal:

```tsx
import { RouteProgress } from 'loadshape';

<RouteProgress pending={pending} className={styles.progress} />;
```

It defaults to div and accepts required pending, render, HTML attributes, className, style, and
forwarded ref. It remains mounted in the navigation layout. The application owns positioning, width,
stacking order, color, and accessible status. In normal flow it reserves its height while hidden.
Completion and cancellation hide it immediately. Reduced-motion shows a stationary full-width bar.

If a new operation replaces a pending operation without an intermediate false, a new React key
on the general component restarts its appearance delay.

### TanStack Router

The adapter requires the optional peer `@tanstack/react-router` at a compatible `^1.170.41`
version and runs inside RouterProvider's persistent root layout:

```tsx
import { Outlet } from '@tanstack/react-router';
import { RouteProgress } from 'loadshape/tanstack-router';

function RootLayout() {
  return (
    <>
      <RouteProgress className={styles.progress} />
      <Outlet />
    </>
  );
}
```

The adapter owns pending and resets the delay when the destination href changes. Its remaining
props match the general component. Both components are decorative; the application owns aria-busy
and any accessible navigation status.

## CSS variables

CSS variables can reference application tokens:

```css
.progress {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  color: var(--accent);
  --route_progress_thickness: var(--spacing_half);
}
```

| Variable                     | Default                                              |
| ---------------------------- | ---------------------------------------------------- |
| `--loadshape_delay`          | `150ms`                                              |
| `--skeleton_delay`           | Shared delay                                         |
| `--skeleton_color`           | `color-mix(in oklab, currentColor 14%, transparent)` |
| `--skeleton_duration`        | `1.4s`                                               |
| `--skeleton_shimmer_opacity` | `0.35`                                               |
| `--spinner_delay`            | Shared delay                                         |
| `--spinner_size`             | `1em`                                                |
| `--spinner_thickness`        | `0.125em`                                            |
| `--spinner_duration`         | `0.8s`                                               |
| `--route_progress_delay`     | Shared delay                                         |
| `--route_progress_thickness` | `0.125em`                                            |
| `--route_progress_duration`  | `1.4s`                                               |

Component delays override the shared delay. All three components wait before appearing, so short
loads do not flash. Skeleton shimmer stops under reduced-motion. Variables starting with `--_`
are internal implementation details.

## Compatibility and scope

ES modules and TypeScript declarations are supplied for both JavaScript entry points. CSS must
be imported separately. CommonJS and legacy CSS engines are outside this release's scope.
The styles use modern CSS including layers, :has(), color-mix(), masks, and the rotate property.
Checks cover current Chromium and WebKit, without claiming every browser or screen reader version.

loadshape provides loading paint and indicators. Fetching, error and empty states, visual tokens,
and predicting unknown content remain application responsibilities.

## Local checkout

An unreleased build can be packed and installed from a local archive:

```sh
pnpm --filter loadshape build
pnpm --filter loadshape pack --pack-destination /tmp
LOADSHAPE_VERSION=$(node -p "require('./packages/loadshape/package.json').version")
# In the consuming application, using the same terminal:
pnpm add "/tmp/loadshape-$LOADSHAPE_VERSION.tgz"
```

Packing the archive requires pnpm: npm does not apply `publishConfig.exports` and leaves `source` conditions
and no license file in the tarball.

License: MIT.
