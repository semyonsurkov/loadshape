# Development

[English](development.md) · [Русский](development.ru.md)

Use the pnpm version pinned in the root `package.json`:

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
pnpm exec prettier --check .
```

The workspace contains `packages/loadshape` (the library) and `apps/playground` (interactive stands).
Read [testing](testing.md) for unit, SSR, browser, and React-version checks.

## Versioning and packaging

Versions and changelogs use Changesets. Its CLI requires Node `^22.11 || ^24 || >=26`.
With a temporary Node 24:

```sh
npx --yes --package=node@24 --call 'pnpm changeset'
npx --yes --package=node@24 --call 'pnpm version-packages'
pnpm --filter loadshape pack --pack-destination /tmp
```

The first command records a change; the second updates versions and changelogs without publishing.
Packing runs the library build through `prepack`. Inspect the archive and install it into a clean
consumer before publishing. Use pnpm to apply `publishConfig.exports` and include the workspace
license; `npm pack` produces a different manifest (see [ADR 0009](adr/0009-publish-with-pnpm-for-publishconfig-exports.md)).

Maintainers publish through the root `pnpm release` script, which runs `changeset publish`.
Publication requires npm authorization and is a separate step from versioning.

## Documentation

English pages use `.md`; Russian counterparts use `.ru.md` in the same directory.
Update both when changing a documented contract, and preserve executable code and API names.
The package's English README is rendered by npm; its Russian counterpart is linked on GitHub.
