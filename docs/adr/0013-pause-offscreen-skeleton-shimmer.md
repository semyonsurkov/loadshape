# 0013. Pause offscreen shimmer with a shared IntersectionObserver

[English](0013-pause-offscreen-skeleton-shimmer.md) · [Русский](0013-pause-offscreen-skeleton-shimmer.ru.md)

- Status: accepted
- Date: 2026-10-31
- Decision makers: Semyon Surkov approved prototype and implementation after the browser audit
- Tracking: [issue #1](https://github.com/semyonsurkov/loadshape/issues/1)

## Context

A synthetic Chromium fixture with 300 groups, each containing five loading Roots, kept 5400
animations active while only two groups were visible. An isolated prototype reduced median style
updates from 497 to 14 ms per second by pausing invisible shimmer. This measures steady animation
work in a development fixture, not production INP or every browser/device.

## Options

- **Continue CSS animations everywhere:** simplest, but retains measured offscreen work.
- **Require application virtualization:** useful for DOM cost, but does not improve existing Root
  integrations automatically and remains an application responsibility.
- **Apply content-visibility or containment:** can affect intrinsic sizes, positioning and application
  layout, which violates the existing geometry contract.
- **Scroll/resize polling or measuring each leaf:** introduces event/timing work and layout reads.
- **Shared IntersectionObserver for loading Roots:** native asynchronous visibility tracking with a
  small client lifecycle and no new runtime dependency or public prop. Selected.

## Decision

Share one IntersectionObserver per owning document while loading Roots are observed. Client effects
register the committed DOM element; a stable internal ref follows element replacement while leaving
consumer refs attached on loading changes. Observer callbacks update the private
`--_skeleton_animation_state` property directly, without React state or a second child tree.

Only skeleton shimmer uses that variable. The appearance-delay animation always runs, so scrolling
never restarts the delay. Visible roots resume; invisible roots pause. Each observed root gets its
own explicit state so nested loading roots do not inherit a paused ancestor's visibility decision.

Server rendering does not access browser APIs or add visibility state. Missing IntersectionObserver
keeps existing CSS behavior. Zero-box entries, including display:contents, remain running because the
root box does not establish child visibility. CSS-only attribute integrations remain unchanged.
Unregister on loading completion, element replacement or unmount; disconnect after the last target.

## Consequences

Public props, public attributes, public CSS variables, inert and layout stay unchanged. The internal
ref is merged with the existing render/forwarded refs through the shared utility. There is one small
client observer lifecycle in addition to CSS paint. Visibility follows the root box, not an inspection
of every descendant; the observer is asynchronous and initial CSS animation may run before its report.

The integration needs checks for scroll/resume, nested and boxless roots, StrictMode, refs, cleanup,
SSR/hydration, missing API and React 18/19. New permanent tests were not requested in this increment;
existing suites and isolated browser checks provide current evidence. No speed claim is made for
arbitrary screens, production JavaScript, GPU or unmeasured platforms.

References: [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver),
[React effect lifecycle](https://react.dev/reference/react/useEffect).
