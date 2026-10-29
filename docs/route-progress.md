# RouteProgress

[English](route-progress.md) · [Русский](route-progress.ru.md)

Roadmap stage 5 was completed on 2026-10-09. The contract is recorded in
[ADR 0007](adr/0007-route-progress-indeterminate-optional-router-adapter.md).

## Behavior and contract

RouteProgress from `loadshape` accepts pending, render, className, ref, and HTML attributes.
It stays mounted and shows only when a transition exceeds --loadshape_delay (150 ms).
The bar conveys activity without an invented percentage. Completion and cancellation hide it;
a new transition starts the delay again.

CSS uses data attributes and variables for thickness, duration, and local delay. Applications
supply currentColor and placement through className. Reduced motion uses a stationary bar.
The component is decorative; the application supplies accessible status and aria-busy.

The `loadshape/tanstack-router` adapter reads TanStack pending state inside RouterProvider and
passes it to the general component. An optional peer and separate entry keep the core import
independent. See the official [useRouterState documentation](https://tanstack.com/router/latest/docs/api/router/useRouterStateHook).

## Completed work

The accepted stage included the ADR/Changeset, core component and styles, separate adapter build,
fast/slow/cancel/replacement playground transitions, delay and reduced-motion checks, mobile
geometry checks in Chromium/WebKit, and independent review before completion.

## Integration

The general component accepts any foreground pending signal. Import CSS once:

```tsx
import { RouteProgress } from 'loadshape';
import 'loadshape/styles.css';

<RouteProgress pending={pending} className={styles.progress} />;
```

For TanStack Router, install optional peer @tanstack/react-router ^1.170.41 and place the adapter
in a persistent root layout. It selects pending and resets the delay when the destination href changes.

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

Use a CSS Module to set position and color. Without fixed/absolute positioning the hidden bar
reserves its height. An inline bar needs only color and thickness.

```css
.progress {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  color: var(--accent);
  --route_progress_thickness: var(--spacing_half);
}
```

| Variable                   | Default                       | Purpose                    |
| -------------------------- | ----------------------------- | -------------------------- |
| --route_progress_thickness | 0.125em                       | Bar height                 |
| --route_progress_duration  | 1.4s                          | Segment traversal duration |
| --route_progress_delay     | --loadshape_delay, then 150ms | Appearance delay           |

Applications own accessible navigation status and aria-busy. If a new operation replaces an active
one without an intermediate pending=false, give the general component a new React key.

## Original verification

The `/stands/progress` stand uses real TanStack loaders, disables link preloading, and increments
a run parameter for repeated navigation. Chromium and WebKit checks on 2026-10-09 confirmed:

- A 100 ms transition and replacement of a slow transition by a fast one showed no bar frame.
- A 1200 ms transition showed the bar after 152 ms in Chromium and 151 ms in WebKit;
  repeated runs measured 150 and 154 ms. Frame timing explains the difference from the CSS delay.
- Completion/cancellation hid both indicators; an old loader did not replace a cancelled or
  superseded destination.
- Reduced motion kept the delay and showed a stationary full-width bar.
- Indicators remained 4 px high; no horizontal scrolling at 375, 768, and 1440 px.
- No JavaScript errors occurred in checked scenarios.

Typecheck, oxlint, library/playground builds, and Prettier passed. The archive contained adapter
JavaScript and types; the main import and its declarations did not import TanStack Router.

## Rejected approach

Checking only status=pending did not reset the CSS delay when a slow transition was replaced by
a fast one: pending stayed true. The adapter now uses the destination href as the general component's
React key; the inline example does the same. Ordinary pending toggles preserve the mounted
component, while replacement operations reset identity through key.
