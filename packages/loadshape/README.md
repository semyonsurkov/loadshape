# loadshape

Loading states for React 19 that use your component's layout and your application's visual tokens.
Skeleton paints the rendered content, Spinner inherits its size and color, and RouteProgress
indicates navigation without inventing a percentage.

## Install

Requires React 19. Version 0.1.0 is prepared for publication; after it is published:

```sh
pnpm add loadshape
```

For an unpublished checkout, build and pack the library, then install the generated archive:

```sh
pnpm --filter loadshape build
pnpm --filter loadshape pack --pack-destination /tmp
# In the consuming application:
pnpm add /tmp/loadshape-0.1.0.tgz
```

Import CSS once at the application entry:

```tsx
import 'loadshape/styles.css';
```

Styles live in `@layer loadshape`. There is no theme or runtime stylesheet injection.
The core entry depends only on React; using it does not require TanStack Router.

## Skeleton

Render the same component in both states, using realistic placeholder data while loading:

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

Keep the application's existing error and empty branches. Placeholder values must satisfy its
real types and formatters, including dates and enums. With TanStack Query, provide placeholderData
and pass isPlaceholderData to loading: placeholder data puts the query in success, so isPending
is false. Preserve cached real data during background refresh and respect disabled queries.

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
For real data, keep entity keys in your normal map.

Repeat does not enable skeleton loading, choose data, create list elements, set `aria-busy`,
or apply layout and spacing. Keep those in the application. If the repeated component already
contains `Skeleton.Root`, pass its loading prop instead of adding another Root.

### Root and Static

| Component         | Props                                                                               | Default element                 |
| ----------------- | ----------------------------------------------------------------------------------- | ------------------------------- |
| `Skeleton.Root`   | Required `loading: boolean`, `render`, HTML attributes, `className`, `style`, `ref` | `div`                           |
| `Skeleton.Static` | `render`, HTML attributes, `className`, `style`, `ref`                              | `span` with `display: contents` |

Use render to apply the mechanism to an existing element:

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

Supply valid elements inside tables, lists, and select; a default span is not a valid child there.
Custom components passed through render must forward HTML attributes and ref to their DOM root.
Static preserves its whole subtree, so include only content known without the request. Put a
dynamic value in its own element beside a static label.

Root becomes inert while loading. Place aria-busy on the application's container outside Root,
since inert removes Root and its descendants from focus and the accessibility tree. Controls
that remain usable, such as cancellation, belong outside Root even if they are visually static.

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

Reserve image dimensions or aspect-ratio in the component. Give inputs, selects, and buttons the
application's styling: painting an unstyled native control can change its size in WebKit. A chart
whose content is entirely SVG needs an application-owned loading representation.

## Spinner

```tsx
import { Spinner } from 'loadshape';

<Spinner />;
<Spinner label="Loading the report" />;
```

Spinner defaults to span and accepts label, render, HTML attributes, className, style, and React 19
ref. Its ring is 1em and currentColor; reserve its slot or match the replaced icon to preserve
layout. It appears after the shared delay and slows rotation threefold under reduced-motion.

Without label it is decorative (`aria-hidden`). With label it has role=status and a visually
hidden text child. Mounting a live region with its initial text does not guarantee an announcement;
keep an application status region mounted before updating its text when that is required.

## RouteProgress

Use the general component with any router or navigation loading signal:

```tsx
import { RouteProgress } from 'loadshape';

<RouteProgress pending={pending} className={styles.progress} />;
```

It defaults to div and accepts required pending, render, HTML attributes, className, style, and
React 19 ref. Keep it mounted in the navigation layout. The application owns positioning, width,
stacking order, color, and accessible status. In normal flow it reserves its height while hidden.
Completion and cancellation hide it immediately. Reduced-motion shows a stationary full-width bar.

If a new operation replaces a pending operation without an intermediate false, give the general
component a new React key to restart its appearance delay.

### TanStack Router

Install the optional peer `@tanstack/react-router` at a compatible `^1.170.41` version, then use
the adapter inside RouterProvider's persistent root layout:

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

Override variables using the application's tokens:

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
be imported separately. React 18, CommonJS, and legacy CSS engines are outside this release's scope.
The styles use modern CSS including layers, :has(), color-mix(), masks, and the rotate property.
Checks cover current Chromium and WebKit, without claiming every browser or screen reader version.

loadshape provides loading paint and indicators. Fetching, error and empty states, visual tokens,
and predicting unknown content remain application responsibilities.

License: MIT.
