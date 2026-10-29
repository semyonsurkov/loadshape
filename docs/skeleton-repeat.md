# Repeated placeholders

[English](skeleton-repeat.md) · [Русский](skeleton-repeat.ru.md)

`Skeleton.Repeat` accepts count and children(index), repeats a template, and adds no DOM wrapper.
The contract and alternatives are recorded in [ADR 0011](adr/0011-skeleton-repeat-without-layout-or-data.md).

The package README and `/stands/list` show integration. Applications own loading state, data,
repeat count, list elements, and spacing. Real data keeps the normal map with entity keys.

## Original acceptance checks

- Typecheck, lint, and build passed.
- Browser checks covered counts 0, 1, and 8, callback indices, and Fragment keys.
- Zero did not call the callback; negative, fractional, NaN, and Infinity counts threw RangeError.
- The stand's ul contained three immediate li children without extra elements.
- Geometry matched before and after loading: each card was 1088 px wide, with heights 186,
  162, and 186 px. Finishing loading removed inert.
- Independent diff review approved the result without findings.

This initial change added no permanent tests; the current suite is described in [testing](testing.md).
Repeat uses neither refs nor version-specific React features. React 18 support was a separate change.
