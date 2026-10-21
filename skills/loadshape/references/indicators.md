# Spinner and RouteProgress

## Spinner

```tsx
import { Spinner } from 'loadshape';

<button type="button" disabled={saving} aria-busy={saving || undefined}>
  {saving ? <Spinner /> : <SaveIcon />}
  Save
</button>;

<Spinner label="Loading the report" />;
```

Spinner defaults to `span`, size 1em and currentColor. Match the replaced icon's size and reserve
the slot when adding an indicator beside text; the library does not reserve a new slot for you.
It accepts render, className, HTML attributes and forwarded ref. Without label it is decorative;
with label it has role=status and visually hidden text. A live region mounted with its initial
text is not guaranteed to announce: an application that needs a guaranteed live update should
keep its status region mounted before changing the text.

| Variable              | Default                           |
| --------------------- | --------------------------------- |
| `--spinner_size`      | `1em`                             |
| `--spinner_thickness` | `0.125em`                         |
| `--spinner_duration`  | `0.8s`                            |
| `--spinner_delay`     | `--loadshape_delay`, then `150ms` |

Reduced-motion slows rotation threefold. Import loadshape/styles.css once at the application entry.

## RouteProgress

For another router, pass its foreground loading signal to the general component:

```tsx
import { RouteProgress } from 'loadshape';

<RouteProgress pending={pending} className={styles.progress} />;
```

RouteProgress defaults to div. It accepts render, className, HTML attributes and forwarded ref.
It is decorative and conveys indeterminate progress, without a percentage. Keep it mounted in a
layout that survives navigation; the application sets aria-busy and an accessible status on the
page container. Completion and cancellation hide it immediately.

For TanStack Router, install the optional peer @tanstack/react-router ^1.170.41 and use the
adapter inside RouterProvider's route layout:

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

The adapter owns pending and resets the appearance delay when the destination href changes.
With the general component, pass a new React key if a new operation replaces an active one
without an intermediate pending=false. Preserve the application's existing routing setup.

```css
.progress {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  color: var(--accent);
  --route_progress_thickness: var(--spacing_half);
}
```

Position, stacking order, color and width belong to the project. In normal flow, the hidden
indicator reserves its height. It neither sets a theme nor imports router code from loadshape's
main entry.

| Variable                     | Default                           |
| ---------------------------- | --------------------------------- |
| `--route_progress_thickness` | `0.125em`                         |
| `--route_progress_duration`  | `1.4s`                            |
| `--route_progress_delay`     | `--loadshape_delay`, then `150ms` |

Reduced-motion keeps the delay and shows a full-width stationary bar.
