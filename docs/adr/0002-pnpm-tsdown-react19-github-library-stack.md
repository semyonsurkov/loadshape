# 0002. Library stack: pnpm, tsdown, React 19, GitHub, and npm

[English](0002-pnpm-tsdown-react19-github-library-stack.md) · [Русский](0002-pnpm-tsdown-react19-github-library-stack.ru.md)

- Status: accepted
- Date: 2026-10-09
- Decision makers: Semyon Surkov and the project agent
- The initial React 19 restriction is superseded by ADR 0010.

## Context

loadshape is a public library with a playground and an integration skill. Decisions were needed
for the package manager, build tool, minimum React version, router adapter, and primary repository.
The owner's other projects used npm and GitLab with mirrors.

## Options

- **npm workspaces:** consistent with those projects, though pnpm was common among the evaluated
  React ecosystem repositories (Base UI, Radix Primitives, TanStack, React Router, Next.js, Vite,
  shadcn/ui, and Zustand), based on their packageManager fields.
- **pnpm workspaces:** strict dependency resolution catches undeclared imports, at the cost of
  differing from the owner's other projects.
- **Turborepo:** an infrastructure default, but two packages offered little caching benefit.
- **tsup:** familiar, but its README declared it unmaintained and directed users to tsdown.
- **tsdown:** the Rolldown-based successor, still at a 0.x version.
- **React 18 and 19:** broader reach, but inert needed a compatibility path like Radix's.
- **React 19 only:** native inert support, initially excluding React 18 applications.
- **TanStack-only RouteProgress:** less code, but excludes other routers.
- **General RouteProgress pending plus an optional adapter:** supports other routers with an
  additional entry point.
- **GitLab as the primary repository:** consistent with other projects, though GitHub makes
  skill installation and public issue discovery straightforward.

## Decision

Use pnpm workspaces without Turborepo, `packages/loadshape` and `apps/playground`, tsdown, an
initial React 19 peer, a general RouteProgress with a TanStack Router adapter, GitHub as primary,
and MIT publication to npm with Changesets. This follows familiar React-library workflows and
allows one-command installation of the skill.

## Consequences

The initial local pnpm 11.9.0 needed updating to the pinned version. Initially React 18 consumers
needed upgrading; ADR 0010 later adds compatibility. Consider Turborepo beyond two or three
packages. GitLab and GitVerse mirrors are optional.
