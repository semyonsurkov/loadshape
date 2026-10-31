# Architecture Decision Records

[English](README.md) · [Русский](README.ru.md)

Accepted decisions and their alternatives:

- [0001. Derive the skeleton from the component and placeholder data](0001-skeleton-rendered-from-the-component-itself.md)
- [0002. Library stack: pnpm, tsdown, React 19, GitHub, and npm](0002-pnpm-tsdown-react19-github-library-stack.md)
- [0003. Skeleton attributes and CSS variables form a public contract](0003-skeleton-public-attributes-and-variables.md)
- [0004. Placeholder data belongs to the query or application](0004-placeholder-data-from-query-not-library-hook.md)
- [0005. Root is inert; the application container owns aria-busy](0005-aria-busy-on-project-container-root-inert.md)
- [0006. Spinner uses a CSS ring and a shared appearance delay](0006-spinner-css-ring-shared-delay.md)
- [0007. Indeterminate RouteProgress with a separate router adapter](0007-route-progress-indeterminate-optional-router-adapter.md)
- [0008. Static content disables ancestor text lines at any depth](0008-static-anywhere-in-block-stops-text-lines.md)
- [0009. Publish through pnpm to apply publishConfig.exports](0009-publish-with-pnpm-for-publishconfig-exports.md)
- [0010. Support React 18 and 19 in one package](0010-react-18-and-19-compatibility.md)
- [0011. Skeleton.Repeat repeats a template without owning layout or data](0011-skeleton-repeat-without-layout-or-data.md)
- [0012. Vitest, Testing Library, and Playwright Browser Mode](0012-test-stack.md)
- [0013. Pause offscreen shimmer with a shared IntersectionObserver](0013-pause-offscreen-skeleton-shimmer.md)
