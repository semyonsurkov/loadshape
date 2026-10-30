# TanStack Query example

An independent Vite application using the published `loadshape` package. It simulates requests locally,
so no API keys or server are needed. It requires Node 20.19+ or 22.12+ as required by Vite.

```sh
cd examples/tanstack-query
npm install
npm run dev
```

Choose Posts, Empty, Error, or Disabled. The 1.2-second delay makes the initial skeleton visible.
With Posts loaded, press Refresh: the cached cards remain visible while a status announces the refresh.
Placeholder data is never persisted to the query cache; `isPlaceholderData` enables the skeleton.

See the [Russian guide](README.ru.md) and [loadshape API](../../packages/loadshape/README.md).
