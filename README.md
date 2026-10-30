# loadshape

[English](README.md) · [Русский](README.ru.md)

**Turn your existing React component into its loading skeleton.**

Render your component with realistic placeholder data and wrap it in `Skeleton.Root`.
loadshape paints its text, media, and controls while keeping the rendered layout.
It also includes an inline `Spinner` and indeterminate `RouteProgress`.

![A list switching between skeleton loading and its rendered content](docs/assets/skeleton.gif)

## Install

Requires **React 18 or 19** and a browser with modern CSS support.

```sh
npm install loadshape
```

Import the stylesheet once at your application entry:

```tsx
import 'loadshape/styles.css';
```

The core package has no runtime dependencies beyond React as a peer.
Styles live in `@layer loadshape`; your application supplies colors, spacing, and component styles.
TanStack Router support is an optional, separate entry point.

## Start with the component you already render

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

Keep your existing error and empty states around this example. Pass `loading` for the initial
request and keep cached real content visible during background refreshes.
`Skeleton.Static` keeps content known before the request visible, such as the section heading.
Place `aria-busy` outside Root because Root becomes inert while loading.

Use `render` to apply Root to an existing element, such as `<ul />` or `<article />`.
Use [`Skeleton.Repeat`](packages/loadshape/README.md#repeated-placeholders) when you need several
placeholder instances of the same component without adding a DOM wrapper.

## Skeletons in different layouts

The same Root can cover a profile card or a page containing a sidebar and a feed.
These recordings switch actual playground components between loading and ready states.

### Profile card

![A profile card switching from skeleton loading to its cover, avatar, text, and button](docs/assets/skeleton-card.gif)

[Source: CardStand](apps/playground/src/pages/CardStand/index.tsx).
The component reserves the cover and avatar dimensions in its own CSS.

### Page with static content

![A page with a profile sidebar and a feed switching from skeleton loading to content while navigation and the feed heading stay visible](docs/assets/skeleton-page.gif)

[Source: PageStand](apps/playground/src/pages/PageStand/index.tsx).
The navigation lives outside Root, and `Skeleton.Static` preserves the feed heading inside it.

## Use your application's colors

Skeleton inherits `currentColor`; container backgrounds, borders, spacing, and SVG icons stay visible.
The screenshot shows the same mechanism on a page, a card, a dark section, and a colored banner.

![Skeleton loading on light, card, dark, and blue surfaces](docs/assets/surfaces.png)

Override [CSS variables](packages/loadshape/README.md#css-variables) with your design tokens.
All three components wait **150 ms** by default before appearing, which avoids a loading flash for
short requests. The delay is configurable, and each component respects reduced-motion preferences.

## Inline spinners

Spinner follows the surrounding font size and text color, so the same component fits buttons,
text, and different surfaces.

```tsx
import { Spinner } from 'loadshape';

export function SaveButton({ saving }: { saving: boolean }) {
  return (
    <>
      <button disabled={saving}>{saving && <Spinner />} Save changes</button>
      <span role="status">{saving ? 'Saving changes' : 'Ready'}</span>
    </>
  );
}
```

The ring is `1em`; reserve an icon slot in your button's CSS if its width must stay fixed.
An unlabelled Spinner is decorative. Use `<Spinner label="Loading the report" />` for a standalone
status, and see the [accessibility notes](packages/loadshape/README.md#spinner) for live announcements.

## Navigation progress

RouteProgress shows activity while navigation is pending. It represents no percentage and hides
when the transition completes or is cancelled.

Use the general component with your application's pending signal:

```tsx
import { RouteProgress } from 'loadshape';

<RouteProgress pending={pending} className={styles.progress} />;
```

Your application owns positioning, color, and accessible navigation status. A built-in
[TanStack Router adapter](packages/loadshape/README.md#tanstack-router) reads pending state and
resets the appearance delay when the destination changes:

```tsx
import { RouteProgress } from 'loadshape/tanstack-router';

<RouteProgress className={styles.progress} />;
```

Keep it mounted inside the router's persistent layout. The adapter requires the optional
`@tanstack/react-router` peer; it is not needed for Skeleton, Spinner, or the general RouteProgress.

## Try the playground

Clone this repository and use the pnpm version pinned in `package.json`:

```sh
git clone https://github.com/semyonsurkov/loadshape.git
cd loadshape
pnpm install
pnpm dev
```

Open the local URL printed by Vite. The playground includes list, card, page, background, edge-case,
spinner, and route-progress stands. Each stand has controls to compare loading and content;
the navigation stand includes 100 ms and 1200 ms transitions.

The [media notes](docs/assets/README.md) describe the recordings and their source stands.

## API and scope

| Component                                                               | Use                                                         |
| ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| [`Skeleton.Root`](packages/loadshape/README.md#root-and-static)         | Paint an existing rendered subtree while `loading` is true. |
| [`Skeleton.Static`](packages/loadshape/README.md#root-and-static)       | Keep request-independent content visible.                   |
| [`Skeleton.Repeat`](packages/loadshape/README.md#repeated-placeholders) | Repeat a placeholder render function without a wrapper.     |
| [`Spinner`](packages/loadshape/README.md#spinner)                       | Show inline activity using the surrounding size and color.  |
| [`RouteProgress`](packages/loadshape/README.md#routeprogress)           | Indicate a pending navigation with an indeterminate bar.    |

The package ships ES modules and TypeScript declarations. Its CSS uses layers, `:has()`,
`color-mix()`, and masks. CommonJS and legacy CSS engines are outside this release's scope.
Fetching, error and empty states, and predicting unknown content remain application responsibilities.
Read the [full compatibility and scope notes](packages/loadshape/README.md#compatibility-and-scope)
before integrating.

## Agent skill

Install the integration guide into your coding agent's skill directory:

```sh
npx skills add semyonsurkov/loadshape --skill loadshape -a codex -y
```

Use the CLI's agent selection for other coding agents. The skill includes TanStack Query examples,
existing loader integration, Spinner, and RouteProgress.

## Development and releases

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm exec prettier --check .
```

See [project documentation](docs/README.md), [testing](docs/testing.md),
and [development and packaging](docs/development.md). Versions and changelogs use Changesets;
versioning and packing are separate from publication.

The main repository is on [GitHub](https://github.com/semyonsurkov/loadshape), with mirrors on
[GitLab](https://gitlab.com/semyonsurkov/loadshape) and
[GitVerse](https://gitverse.ru/semyonsurkov/loadshape).

[MIT License](LICENSE).
