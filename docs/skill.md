# Integration skill verification

[English](skill.md) · [Русский](skill.ru.md)

Roadmap stage 6 completed on 2026-10-10 under the accepted plan.

## Result

`skills/loadshape/SKILL.md` guides integration into existing React components. The original checks
used React 19; the skill now covers React 18 and 19. It preserves markup, supplies correctly typed
placeholder data, marks known content with Skeleton.Static, and places aria-busy on the application
container. It also covers Spinner, RouteProgress, tokens, and the package README's limitations.

The repository ships the skill separately from npm. Install it with
`npx skills add semyonsurkov/loadshape --skill loadshape`; no global personal skills are modified.

## Completed work

The stage produced a compact skill, TanStack Query/plain-loader references, frontmatter/link/API
checks, an independent playground integration in a worktree, a real React application integration,
browser/build/lint checks, and independent reviews.

## Playground checks

An agent with no prior context integrated Skeleton into a list worktree without manual fixes.
Root reused the existing ul, Static preserved a button label, and aria-busy remained outside Root.
Typecheck, oxlint, build, and formatting passed. Chromium checks at 375/768/1440 px found matching
card and child coordinates in both states, and covered inert, appearance delay, and reduced motion.
Independent review returned approved.

Local installation from the repository copied SKILL.md and both reference files unchanged.
A GitHub installation in a temporary directory produced the same result.

## Real application checks

An agent installed the npm archive in a separate application worktree and replaced manual summary
table bones with the actual Table using placeholder SummaryRows. Root rendered Table; Static
rendered Thead; aria-busy stayed on the outer container. No manual fixes were required; build,
lint, and independent review passed.

Chromium/WebKit at 375/768/1440 px confirmed matching table and cell rectangles for comparable
data. Checks covered inert, visible headers, reduced motion, empty responses, summary errors,
and refetch with retained real data. Fast responses completed in 35–46 ms, before the 150 ms delay.
The original application's error behavior rendered an empty table and was preserved.

Unexpected long headings increased mobile line counts, so exact geometry is not guaranteed for
arbitrary responses. Existing 375 px table overflow was preserved; container scroll positions were
normalized for measurements. Workspace typecheck, lint, build, and Prettier passed. Real APIs and
screen readers were not tested; temporary browser mocks supplied responses. Integration changes
were not transferred back from worktrees into the original projects.

## Excluded approaches

Examples omit nonexistent CSS variables. Frontmatter validation, local links, and API consistency
were checked independently. Verification describes the integration checks performed at the time;
current permanent library tests are documented separately.
