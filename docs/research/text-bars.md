# Text-line bones without changing component markup

[English](text-bars.md) · [Русский](text-bars.ru.md)

Stage 2 investigation, 2026-10-09, Chromium in an embedded browser. The stand used a card with an
avatar, two-line heading, three-line paragraph, and button on white, dark, and blue backgrounds.

## Working approach

**Thick underlines over glyphs.** Hide text using -webkit-text-fill-color:transparent and draw
text-decoration:underline with 0.72em thickness, -0.62em offset, and text-decoration-skip-ink:none.
Each line matches text width, including a shorter final paragraph line. Painting properties keep
layout intact. color-mix(in oklab, currentColor 14%, transparent) derives a suitable color from
surrounding text on each tested background.

**Shimmer through an opacity mask.** A linear mask with a middle opacity of 0.35, 300% size, and
animated mask-position over 1.4s reveals the actual underlying background. It works on text bones,
images, and buttons without choosing a separate highlight color.

## Rejected approaches

- Highlight API requires walking text nodes in JavaScript, lacks rounded/gradient styling, and
  resolves currentColor to the highlight color rather than the surrounding text.
- A repeating gradient at 1lh spacing paints full block-width lines, including short headings
  and the final paragraph line.
- background-clip:text does not clip the underline in Chrome, leaving a solid decoration color.
- color:transparent removes the useful currentColor value, unlike -webkit-text-fill-color.

## Library verification

The mechanism in packages/loadshape/src/styles.css was checked with Playwright on list, card,
page, and background stands in Chrome 154 and WebKit 26.4:

- 0 of 140 elements moved when toggling loading in either engine.
- At 100 ms after enabling loading, the line remained transparent; by 600 ms it was visible.
- Dark mode used lighter bones automatically. Reduced motion removed shimmer while retaining delay.

Implementation and review exposed these issues:

- Newlines accidentally introduced descendant combinators into a compound selector, disabling
  text lines. The conditions now stay together under prettier-ignore.
- CSS Modules outside @layer overrode button backgrounds and link decoration. Mechanism
  properties use !important; applications customize through --skeleton_* variables.
- Animation could not override important colors, so appearance delay now animates the internal
  --_skeleton_paint variable consumed by those properties.
- WebKit used child-specific underline thickness in flex metadata rows. Descendants now inherit
  matching thickness/offset without adding their own line; existing link/strikethrough decoration
  must be removed to prevent opaque paint.
- A descendant combinator excluded the root itself: inline roots lost text without a bone, and
  button roots became blank. Root now participates alongside descendants.
- A blue button's own white text produced a white bone on a white card. Bones now inherit color
  from their surroundings.
- Painting unstyled WebKit controls triggered fallback rendering: select width 79→92 px, search
  input height 19→30 px, button height 29→33 px. Background/border CSS cannot avoid this. Controls
  with application styling stayed fixed on the edge-case stand.
- Hiding Root inside :where(root, root *) prevented fast selector rejection and evaluated :has()
  across every page element. On a 19,509-element page without skeletons, median of 15 full style
  recalculations was 4.2 ms Chrome/11 ms WebKit without library CSS, 8.6/15 ms with the hidden root,
  and 4.3/11 ms after restoring the root attribute at the start of each selector.

The fifth edge-case stand adds inline/button roots, links, s/strong inside paragraphs, checkbox
labels, styled controls, picture, and hr. Across all five stands, 0 of 166 elements moved in Chrome
and WebKit.

## Limitations

- Controls need application styling and media needs dimensions/aspect-ratio; otherwise WebKit
  may resize native controls or an empty image may collapse.
- Static content at any depth disables its containing block's underline, since descendants cannot
  cancel ancestor decoration. Eligible inline descendants still receive lines. A bare dynamic
  text node beside Static therefore needs its own element, such as a span around a price value.
- Text next to a nested block (`<li>Item <ul>…</ul></li>`) is hidden without a line: CSS cannot
  select the bare text node independently.

## Open questions

- Firefox was not verified: Playwright Firefox 148 failed to launch within five minutes on the
  test machine, apparently blocked by macOS on initial launch.
- Underline ends are rectangular; CSS cannot round this decoration.
- Per-element masks have independent phases, so adjacent shimmer waves are not synchronized.
- A hidden embedded browser paused animation timelines, so delay/shimmer checks required Playwright.
