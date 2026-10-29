# 0009. Publish through pnpm to apply publishConfig.exports

[English](0009-publish-with-pnpm-for-publishconfig-exports.md) · [Русский](0009-publish-with-pnpm-for-publishconfig-exports.ru.md)

- Status: accepted
- Date: 2026-10-21
- Decision makers: Semyon Surkov and the project agent following library review

## Context

package.json has working exports with source conditions and publishConfig exports pointing at
dist without source. Archive checks used pnpm pack, but the publishing command was unspecified.
At this decision's date npm pack produced a different artifact: 11 files, no LICENSE, source
conditions in the manifest, and no src directory.

## Options

- Remove source from working exports: workspace consumers would need a build before each dev
  server run. Rejected.
- Publish through npm after manually cleaning the manifest: easy to forget and only breaks for
  a consumer whose bundler enables source. Rejected.
- Publish with changeset publish, which calls pnpm publish for a pnpm packageManager and applies
  publishConfig. Selected.

## Decision

The root release script runs changeset publish; maintainers use `pnpm release`. The development
guide records that command and archive verification through pnpm pack. The npm publishing path
is not used.

## Consequences

Working exports retain source conditions; published exports remove them. npm publish would
otherwise reference absent source files and omit the license, so publication lives in the script.
npm pack is useful to diagnose the difference, not to create a release artifact.
