# Next.js App Router example

An independent Next.js application using the published `loadshape` package. Its route handler
simulates responses locally; no external API or keys are required. Next.js 16 requires Node 20.9+.

```sh
cd examples/nextjs
npm install
npm run dev
```

Choose Posts, Empty, Error, or Disabled. The simulated 1.2-second response shows the skeleton on
initial load. With Posts loaded, press Refresh: the previous data remains visible until the next
response. CSS is imported once in the root layout, and the interactive demo is a client component.

See the [Russian guide](README.ru.md) and [loadshape API](../../packages/loadshape/README.md).
