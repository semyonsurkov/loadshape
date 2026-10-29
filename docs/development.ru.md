# Разработка

[English](development.md) · [Русский](development.ru.md)

Используй версию pnpm, закреплённую в корневом `package.json`:

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
pnpm exec prettier --check .
```

В workspace находятся `packages/loadshape` с библиотекой и `apps/playground` с интерактивными
стендами. Уровни тестов и проверки версий React описаны в [руководстве по тестам](testing.ru.md).

## Версии и упаковка

Версии и changelog ведутся через Changesets. Его CLI требует Node `^22.11 || ^24 || >=26`.
Для запуска с временным Node 24:

```sh
npx --yes --package=node@24 --call 'pnpm changeset'
npx --yes --package=node@24 --call 'pnpm version-packages'
pnpm --filter loadshape pack --pack-destination /tmp
```

Первая команда записывает изменение; вторая обновляет версии и changelog без публикации.
Упаковка собирает библиотеку через `prepack`. Перед публикацией проверь архив и установи его
в чистый проект. Используй pnpm, чтобы применить `publishConfig.exports` и включить лицензию
workspace: `npm pack` создаёт другой манифест, как описано в [ADR 0009](adr/0009-publish-with-pnpm-for-publishconfig-exports.ru.md).

Мейнтейнеры публикуют пакет корневой командой `pnpm release`, которая вызывает `changeset publish`.
Публикация требует авторизации npm и выполняется отдельно от изменения версии.

## Документация

Английские страницы имеют расширение `.md`, русские лежат рядом с расширением `.ru.md`.
При изменении контракта обновляй обе версии, сохраняя исполняемый код и имена API.
Английский README пакета отображается в npm; ссылка на русский ведёт в GitHub.
