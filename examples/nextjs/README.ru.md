# Пример Next.js App Router

Самостоятельное приложение Next.js использует опубликованный пакет `loadshape`. Route handler
имитирует ответы локально, поэтому внешний API и ключи не нужны. Next.js 16 требует Node 20.9+.

```sh
cd examples/nextjs
npm install
npm run dev
```

Выбери Posts, Empty, Error или Disabled. Задержка ответа 1,2 секунды позволяет увидеть скелетон
первой загрузки. После загрузки Posts нажми Refresh: прежние данные останутся видимыми до нового
ответа. CSS подключён один раз в корневой раскладке, интерактивный пример является клиентским.

Доступны [английская версия](README.md) и [API loadshape](../../packages/loadshape/README.ru.md).
