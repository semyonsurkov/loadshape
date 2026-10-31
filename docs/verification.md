# Reproducing a playground check

[English](verification.md) · [Русский](verification.ru.md)

## Card: content, skeleton, content

This check drives the existing `/stands/card` playground through its controls. It verifies the
integration of the real `Skeleton.Root`, playground CSS and browser focus behavior. It uses the
playground's built-in profile fixture and data-URL images; no backend, authentication, MSW or
external account is required. It does not claim to test data fetching or the Follow action.

From the repository root, with the pinned pnpm and installed workspace dependencies:

```sh
agent-browser --version
pnpm --filter playground verify:card
```

The command requires the `agent-browser` CLI and its supported Chrome/Chromium installation.
It does not install dependencies or browsers automatically. If the CLI is missing, install it
using the [official instructions](https://agent-browser.dev/installation). The verification uses
Vite's existing configuration and source resolution, so no published package or separate build
is required. Vite listens only on loopback and obtains its own available port; existing servers
are not reused or stopped. Each run creates a separate browser session without a personal profile.

The browser opens Card with a 1440 × 1000 viewport, selects the light theme, a 375 px preview and
long text, then follows one journey:

1. Click **Show content**. Confirm the actual viewport and preview width, readable profile text,
   decoded images and a focusable Follow button.
2. Click **Show loading**. Observe `data-skeleton="loading"`, `inert`, `aria-busy` on the outer
   container and transparent text. Wait for the painted skeleton and confirm that Follow cannot
   receive focus. Compare the root, card, images, heading, biography, stats and button coordinates
   with their loaded state, allowing at most 0.5 CSS px per coordinate/dimension.
3. Click **Show content** again. Confirm restored text, focus and geometry, and no uncaught
   browser errors. The check never sets React state or toggles loading attributes directly.

The command prints `PASSED` or `FAILED` and the report path, and exits nonzero on a failed check
or cleanup. Evidence goes into a new `.scratch/verification/card/<run>/` directory on every run:

- `report.json` contains actual measurements, command results, limits and cleanup status.
- `content.png`, `loading.png` and `recovered.png` show the three observed states.
- `failure.png` is attempted if a browser-stage check fails.

The verifier closes only its own browser session and Vite instance, including on a failed check.
Cleanup preserves the evidence. The report's URL stops working after cleanup. To view the same
scenario manually on a separate server:

```sh
pnpm dev --host 127.0.0.1 --port 4187 --strictPort
```

Open `http://127.0.0.1:4187/stands/card` and repeat the controls above. An occupied port causes an
error; stop your own earlier server or choose another port. Stop this manually started server
with Ctrl+C after viewing it.

## Scope and maintenance

This is one reproducible playground journey, not the complete browser/React compatibility
matrix. It does not check React 18, WebKit, other stands, real data fetching, exact 150 ms timing,
pixel-perfect visual parity or subjective UI quality. See [testing](testing.md) for the existing
unit, SSR and browser suites. User acceptance remains separate from the automated result.

Keep the control labels and DOM observations in
`apps/playground/scripts/verify-card.mjs` aligned with the actual Card stand. Preserve a failing
report before investigating; do not weaken the scenario to make it pass. Dev-flow task state
lives separately in `.scratch/dev-flow/<task>/state.md`; this page is the maintained scenario.
