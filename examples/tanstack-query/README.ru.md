# Пример TanStack Query

Самостоятельное приложение Vite использует опубликованный пакет `loadshape`. Ответы имитируются
локально, поэтому API-ключи и сервер не нужны. Требуется Node 20.19+ или 22.12+ согласно Vite.

```sh
cd examples/tanstack-query
npm install
npm run dev
```

Выбери Posts, Empty, Error или Disabled. Задержка 1,2 секунды позволяет увидеть скелетон первой
загрузки. После загрузки Posts нажми Refresh: карточки останутся видимыми, а статус сообщит об
обновлении. Подставные данные не сохраняются в кеш запроса; скелетон включается через isPlaceholderData.

Доступны [английская версия](README.md) и [API loadshape](../../packages/loadshape/README.ru.md).
