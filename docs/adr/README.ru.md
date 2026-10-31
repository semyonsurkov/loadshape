# Architecture Decision Records

Журнал архитектурных решений проекта.

- [0001. Скелетон строится из самого компонента с подставными данными](0001-skeleton-rendered-from-the-component-itself.ru.md) — accepted
- [0002. Стек библиотеки: pnpm workspace, tsdown, React 19, GitHub и npm](0002-pnpm-tsdown-react19-github-library-stack.ru.md) — accepted
- [0003. Публичный контракт заглушки: атрибуты data-skeleton и переменные --skeleton_*](0003-skeleton-public-attributes-and-variables.ru.md) — accepted
- [0004. Подставные данные идут через placeholderData TanStack Query, а не через хук библиотеки](0004-placeholder-data-from-query-not-library-hook.ru.md) — accepted
- [0005. Корень заглушки получает inert, aria-busy ставит проект на свой контейнер](0005-aria-busy-on-project-container-root-inert.ru.md) — accepted
- [0006. Spinner это CSS-кольцо на currentColor с общей задержкой --loadshape_delay](0006-spinner-css-ring-shared-delay.ru.md) — accepted
- [0007. RouteProgress показывает неопределённый прогресс и имеет отдельный адаптер роутера](0007-route-progress-indeterminate-optional-router-adapter.ru.md) — accepted
- [0008. Статичный отменяет полосы блока на любой глубине вложенности](0008-static-anywhere-in-block-stops-text-lines.ru.md) — accepted
- [0009. Публикация идёт через pnpm, потому что только он применяет publishConfig.exports](0009-publish-with-pnpm-for-publishconfig-exports.ru.md) — accepted
- [0010. Поддержка React 18 и 19 одним пакетом](0010-react-18-and-19-compatibility.ru.md) — accepted
- [0011. Skeleton.Repeat повторяет шаблон без управления данными и раскладкой](0011-skeleton-repeat-without-layout-or-data.ru.md) — accepted
- [0012. Тестовый стек: Vitest, Testing Library и Browser Mode на Playwright](0012-test-stack.ru.md) — accepted
- [0013. Приостанавливать мерцание вне экрана общим IntersectionObserver](0013-pause-offscreen-skeleton-shimmer.ru.md)
