# Skeleton integration

## Contract

```tsx
import { Skeleton } from 'loadshape';
import 'loadshape/styles.css';

<section aria-busy={loading || undefined}>
  <Skeleton.Root loading={loading}>
    <Skeleton.Static render={<h2 />}>Recent posts</Skeleton.Static>
    <PostList posts={posts} />
  </Skeleton.Root>
</section>;
```

Root defaults to `div`; `render={<ul />}` or an existing component avoids adding a wrapper.
Root accepts HTML attributes, className, style and React 19 ref. It sets
`data-skeleton="loading"` and inert while loading. The surrounding application container owns
aria-busy. Components used through render must forward HTML attributes and ref to their DOM root.

Static defaults to a `span` with display: contents. Inside `table`, `thead`, `tbody`, `tr`, `ul`
and `select`, supply a valid existing element through render, such as
`<Skeleton.Static render={<Table.Thead />}>...</Skeleton.Static>`. A static subtree stays visible
in full, so put only request-independent content inside it.

Keep dynamic text in a separate element from a static label on the same line. For example,
`<Skeleton.Static>Price</Skeleton.Static> <span>{price}</span>` keeps the label visible while
painting the value. Mark intentionally empty leaves with `data-skeleton-bone=""`.

## TanStack Query

Use placeholderData for the normal first-load case. Placeholder data makes the query successful,
so isPlaceholderData is the loading signal; isPending is false in this state.

```tsx
const PLACEHOLDER_POSTS: Post[] = [
  { id: 'placeholder-1', title: 'A representative post title', excerpt: 'Typical summary text.' },
  {
    id: 'placeholder-2',
    title: 'Another title with a different length',
    excerpt: 'A longer summary.',
  },
];

const posts = useQuery({
  queryKey: ['posts', category],
  queryFn: () => fetchPosts(category),
  placeholderData: PLACEHOLDER_POSTS,
});

if (posts.isError) return <ExistingErrorState error={posts.error} />;
if (!posts.data?.length) return <ExistingEmptyState />;

return (
  <section aria-busy={posts.isPlaceholderData || undefined}>
    <Skeleton.Root loading={posts.isPlaceholderData}>
      <PostList posts={posts.data} />
    </Skeleton.Root>
  </section>
);
```

The example's Post shape is illustrative; use every field required by the real component and its
formatters. Keep placeholders outside render when they are constant. Choose stable placeholder
IDs, normal row counts, valid dates and enum values, and varied text and numbers close to real data.
Respect the query's enabled condition: a query that is intentionally disabled is not an active
load. Preserve applications that already keep previous real data during a key change.

Official semantics:
[TanStack Query placeholder data](https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data).

## Loading without Query

Keep the application's existing data loader. Use `data ?? PLACEHOLDER` and its actual loading flag;
loadshape does not export usePlaceholder or manage fetching.

```tsx
if (error) return <ExistingErrorState error={error} />;
if (data && data.length === 0) return <ExistingEmptyState />;

return (
  <section aria-busy={loading || undefined}>
    <Skeleton.Root loading={loading}>
      <PostList posts={data ?? PLACEHOLDER_POSTS} />
    </Skeleton.Root>
  </section>
);
```

## Geometry and limitations

- The library paints text lines, images, buttons, inputs, and empty bones while preserving
  container backgrounds, borders, and spacing. It cannot predict the length of unknown real text.
- Set image dimensions or aspect-ratio in the existing component styles. An image with no
  reserved geometry can collapse before it loads.
- Give form controls their project styling. WebKit can change the size of an unstyled search
  field, select, or button when its background is painted.
- SVG icons stay visible. A chart whose whole visual content is SVG needs a deliberate
  application-owned loading representation; wrapping an arbitrary chart does not guarantee bones.
- A loading root is inert even for visually static descendants. Keep controls that should remain
  usable, such as cancellation, outside that root.

## CSS variables

Use project tokens to override these variables on the application or a particular root:

| Variable                     | Default                   | Purpose                 |
| ---------------------------- | ------------------------- | ----------------------- |
| `--loadshape_delay`          | `150ms`                   | Shared appearance delay |
| `--skeleton_delay`           | shared delay              | Local appearance delay  |
| `--skeleton_color`           | derived from currentColor | Bone color              |
| `--skeleton_duration`        | `1.4s`                    | Shimmer duration        |
| `--skeleton_shimmer_opacity` | `0.35`                    | Shimmer opacity         |

Reduced-motion disables shimmer and preserves the appearance delay.
