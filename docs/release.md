# Релиз 0.1.0: план этапа 7

Статус: локальная подготовка 0.1.0 завершена 2026-10-10, внешний релиз ожидает отдельной команды.

## Локальная подготовка

- [x] Написать README с установкой, импортом CSS и примерами Skeleton, Spinner и RouteProgress.
- [x] Добавить текст лицензии MIT и документацию ограничений.
- [x] Настроить changesets, проверить существующие записи и подготовить версию 0.1.0 с changelog.
- [x] Проверить TypeScript, линтер, форматирование, сборку и содержимое npm-архива.
- [x] Установить упакованную библиотеку в чистый временный React-проект и проверить основной импорт,
      CSS и отдельный адаптер с установленным TanStack Router.
- [x] Провести ревью подготовленного релиза и записать готовность к публикации.

## Версия и команды

Changesets 3.0.3 настроен с public access, базовой веткой main и без автокоммитов.
Команда version обработала записи Skeleton, Spinner и RouteProgress и подготовила
версию 0.1.0 с changelog. prepack пересобирает библиотеку перед созданием архива.

Системный Node 25.8.2 не входит в поддерживаемые версии Changesets 3. Для команд релиза
по выбору пользователя использован временный Node 24.21.0; системная версия не менялась.

```sh
npx --yes --package=node@24 --call 'pnpm changeset status'
npx --yes --package=node@24 --call 'pnpm version-packages'
```

Документация: [требования Changesets](https://changesets.dev/guide/getting-started),
[конфигурация](https://changesets.dev/guide/config).

## Проверка архива

Typecheck, oxlint, Prettier и сборки библиотеки и playground прошли. Архив
`loadshape-0.1.0.tgz` содержит 12 файлов: собранные JS, declarations, CSS, package.json,
README, changelog и лицензию. В exports нет source-условий и ссылок на src;
обычных runtime dependencies нет, TanStack Router остаётся optional peer.

## Чистый потребитель

Временный React 19 проект установлен из архива без workspace-ссылок. Основной импорт
проверен до установки TanStack Router: SSR с Skeleton, Spinner и RouteProgress работает
с единственным React peer. TypeScript проверяет declarations, Vite собирает CSS и JS.

После установки optional peer `@tanstack/react-router@1.170.41` проверены отдельный
импорт адаптера, declarations и production-сборка обеих страниц. В Chromium и WebKit
production preview подтвердил загрузочный Skeleton без сдвига карточки, Static, inert,
aria-busy, стили Spinner и общий RouteProgress. Адаптер показывает полосу на переходе
1200 мс, скрывает её после завершения; после перехода 100 мс полоса скрыта.

Архив сохранён локально в `dist/release/loadshape-0.1.0.tgz`, SHA-256:
`c2695809c174ee1ecb19b3fa4e539e9ea4808df1cb3ba4a588d5b9a644c19624`.
Временные browser scripts и потребитель оставлены вне репозитория, постоянные тесты не добавлялись.

## Ревью и готовность

Все шесть пунктов локальной подготовки закрыты. README, лицензия, конфигурация Changesets,
архив и проверка чистого потребителя прошли независимое ревью с approved. Рабочее дерево
библиотеки чистое, изменения этапа закоммичены по пунктам.

## Внешние действия

Пользователь разрешил публикацию. Публичный репозиторий
[semyonsurkov/loadshape](https://github.com/semyonsurkov/loadshape) создан, main отправлен.
Установка `npx skills add semyonsurkov/loadshape --skill loadshape -a codex -y` проверена
в отдельном временном каталоге; скилл и references установились без изменений.

В npm-пакет добавлены repository, homepage и bugs, архив пересобран. Публикация npm
ожидает авторизации пользователя: `npm whoami` вернул ENEEDAUTH. Системные хранилища
учётных данных не исследовались. Критерий установки из npm пока не выполнен.

## Ограничения проверки

Consumer-сборка выводит предупреждения Rolldown о директивах use client в зависимости
TanStack Router. Production SPA работает; React Server Components и интеграции SSR
конкретных фреймворков этим прогоном не проверялись.

При добавлении router peer в работающий dev-сервер Vite один прогон поймал ошибку
useContext одновременно с переоптимизацией зависимостей и перезагрузкой страницы.
Повторный прогон в обоих браузерах и production preview прошли без ошибок. Причинная
связь с промежуточным графом dev-сервера пока не доказана; код библиотеки не менялся.

## Что не сработало

Лицензия MIT берётся из корня workspace при `pnpm pack`; проверено содержимым архива.
Changelog добавлен в files явно: первоначальный архив с files: [dist] его не содержал.
Отдельную копию лицензии в пакете не заводили, чтобы текст не расходился.
