# 0008. Static content disables ancestor text lines at any depth

[English](0008-static-anywhere-in-block-stops-text-lines.md) · [Русский](0008-static-anywhere-in-block-stops-text-lines.ru.md)

- Status: accepted
- Date: 2026-10-21
- Decision makers: Semyon Surkov and the project agent following library review

## Context

Text bones use underlines on blocks containing only inline children. A descendant cannot remove
an ancestor's decoration, so a block with static content must not receive that underline.
Previously only direct static children were checked; nesting Static in a link or wrapper painted
its label over a bone, contradicting the documented static subtree behavior.

## Options

- Require direct children only in documentation: rejected because ordinary links and typography
  wrappers introduce nesting, and the defect is only visually apparent.
- Give Static inline-block display to stop inherited decoration: rejected because it changes
  the geometry preserved by display:contents.
- Detect static content at any depth: selected; the containing block gets no underline while
  eligible inline descendants without static content can still receive their own lines.

## Decision

The text-line selector checks data-skeleton-static at any descendant depth. The containing block
gets no underline, and inline descendants without static content receive the decoration.
Applications wrap dynamic values beside static labels in their own elements.

## Consequences

Static subtrees remain free of lines at every depth. If static and dynamic text share the same
inline chain, that entire block loses its line because CSS cannot separate the inherited
paint. This is a reason to separate the markup, documented in the README and integration skill.
