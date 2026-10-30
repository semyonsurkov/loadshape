# README media

The GIFs and list screenshots were captured on 2026-10-30 from the loadshape 0.2.0 playground.
Their fixture text was translated in a temporary build. The surfaces screenshot uses the current
English playground built against loadshape 0.2.2. None uses external or private data.
The skeleton and content states use the same data, so these examples demonstrate the geometry
of the rendered tree rather than a prediction of an unknown response.

| Asset                  | Playground route      | Output                                    |
| ---------------------- | --------------------- | ----------------------------------------- |
| `skeleton.gif`         | `/stands/list`        | 960 px wide, 12 fps; loading, then ready  |
| `skeleton-card.gif`    | `/stands/card`        | 392 × 414 px, 12 fps; loading, then ready |
| `skeleton-page.gif`    | `/stands/page`        | 960 px wide, 12 fps; loading, then ready  |
| `skeleton-loading.png` | `/stands/list`        | 1120 × 704 px, loading                    |
| `skeleton-content.png` | `/stands/list`        | 1120 × 704 px, ready                      |
| `surfaces.png`         | `/stands/backgrounds` | 1120 × 704 px, loading                    |

The list uses `Skeleton.Repeat`. The page keeps navigation outside Root and its feed heading
inside `Skeleton.Static`. Styling belongs to the playground, not to the library.

## Capture

Build and serve the playground without development overlays:

```sh
pnpm --filter playground build
pnpm --filter playground exec vite preview --host 127.0.0.1 --port 4185
```

The original GIFs were recorded from a playground using `loadshape@0.2.0` in Chromium with a separate
`agent-browser` session, dark color scheme, and normal motion. Their Russian fixture and control
text was translated in a temporary build. The current playground has English text and extra
controls; use its `Show content` / `Show loading` buttons to record new footage.

Use a 1120 × 704 viewport for the list, 800 × 620 for the card, and 1120 × 1000 for the page.
Wait for the 150 ms appearance delay, record at 15 fps, capture a screenshot after each switch,
and hold each state for at least two seconds. The current surfaces screenshot uses light mode
and a 1120 × 704 viewport.

Crop the card recording to `392:414:0:94` and the page to `1120:760:0:94` with ffmpeg's
`crop=width:height:x:y` filter. The card crop removes the stand controls and empty space;
the page crop retains the example's navigation. The list retains the stand controls.
Trim extra holds, then encode looping GIFs with a 128-color palette:

```sh
ffmpeg -i /tmp/capture.webm \
  -vf 'fps=12,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle' \
  -loop 0 /tmp/demo.gif
```

Keep the card at its cropped native size instead of scaling it to 960 px.
Inspect frames from both states after conversion. Static PNG links accompany the first GIF
for readers who prefer still images.

The package README uses absolute raw GitHub image URLs so it can render on npm after publication.
The root README uses repository-relative paths. Media is stored here and excluded from the npm
archive by the package's `files` list.
