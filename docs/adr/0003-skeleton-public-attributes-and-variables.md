# 0003. Skeleton attributes and CSS variables form a public contract

[English](0003-skeleton-public-attributes-and-variables.md) · [Русский](0003-skeleton-public-attributes-and-variables.ru.md)

- Status: accepted
- Date: 2026-10-09
- Decision makers: Semyon Surkov and the project agent during roadmap stage 2

## Context

The mechanism lives in `loadshape/styles.css` and is enabled by application markup. Attribute and
variable names therefore form a consumer contract; changing them can break applications silently.
Static content, intentionally empty leaves, and customization need explicit names.

## Options

- **Generic data-loading:** short, but likely to collide with application attributes.
- **data-loadshape-\*:** namespaced, but longer; component-specific names already separate the
  skeleton, spinner, and progress mechanisms.
- **data-skeleton, data-skeleton-static, data-skeleton-bone, and --skeleton\_*:** readable,
  component-specific names with snake_case variables matching existing tokens, though an
  application-defined data-skeleton could still collide.
- **Automatically painting empty background elements through :empty:** also selects spacers and
  separators, while CSS cannot reliably determine whether a background represents content.
- **Painting SVG icons:** consistent appearance, but icons are often known before the request.
- **Overriding ordinary CSS properties:** insufficient because mechanism properties need
  `!important` to survive application CSS Modules outside the layer.

## Decision

Use `data-skeleton="loading"` on Root, `data-skeleton-static` for known content, and
`data-skeleton-bone` for intentional empty leaves. SVG remains visible; images, video, buttons,
and inputs become bones. Customization uses `--skeleton_color` (14% currentColor),
`--skeleton_delay` (150 ms), `--skeleton_duration` (1.4 s), and
`--skeleton_shimmer_opacity` (0.35). Leading-underscore names such as `--_skeleton_paint`
are internal.

## Consequences

Applications need no library class names. The integration skill marks intentional empty leaves.
Renaming public names requires an ADR and a breaking Changeset. An application already using
its own data-skeleton attribute must avoid the collision.
