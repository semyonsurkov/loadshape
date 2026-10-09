# loadshape

Loading states for React 19: skeletons rendered from your actual component, inline spinners,
and indeterminate route progress. The application keeps its layout and supplies its own tokens.

The core package has no runtime dependencies beyond React. TanStack Router support is a separate
entry point with an optional peer dependency.

- [Installation, API, examples, and limitations](packages/loadshape/README.md)
- [Integration skill for coding agents](skills/loadshape/SKILL.md)
- [Project documentation](docs/README.md)
- [Release preparation](docs/release.md)

## Local development

Use the pnpm version pinned in package.json:

```sh
pnpm install
pnpm dev
```

The playground includes list, card, page, background, edge-case, spinner, and route-progress stands.

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm exec prettier --check .
```

## Agent skill

From a local checkout, install the skill into the current project's agent directory:

```sh
npx skills add /absolute/path/to/loadshape --skill loadshape -a codex -y
```

Use the CLI's agent selection for other coding agents. The skill includes examples for TanStack
Query and existing loaders, plus Spinner and RouteProgress integration.

Version 0.1.0 is being prepared locally. Registry installation and installation from GitHub are
verified after publication; no remote repository URL is assumed here.

## Versioning

Changesets 3 requires Node `^22.11 || ^24 || >=26`. To run release commands with temporary Node 24
without changing the system Node version:

```sh
npx --yes --package=node@24 --call 'pnpm changeset'
npx --yes --package=node@24 --call 'pnpm version-packages'
```

The first command records a change; the second consumes changesets, updates package versions,
and generates the changelog. Neither command publishes. Packing rebuilds the library through
prepack. External release steps are tracked in [the release plan](docs/release.md).

License: MIT.
