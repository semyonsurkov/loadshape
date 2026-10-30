# loadshape

[English](README.md) · [Русский](README.ru.md)

**Состояния загрузки на основе React-компонентов.**

`Skeleton` закрашивает текст, медиа и элементы управления существующего компонента, который
приложение отображает с подставными данными, сохраняя его раскладку. В библиотеку также входят
строчный `Spinner` и индикатор неопределённого прогресса `RouteProgress`.

![Список переключается со скелетона загрузки на готовый контент](docs/assets/skeleton.gif)

[Интерактивный playground](https://semyonsurkov.github.io/loadshape/)

## Установка

Нужны **React 18 или 19** и браузер с поддержкой современного CSS.

```sh
npm install loadshape
```

Стили подключаются один раз в точке входа приложения:

```tsx
import 'loadshape/styles.css';
```

У основного пакета нет runtime-зависимостей, кроме React как peer.
Стили находятся в `@layer loadshape`; цвета, отступы и оформление компонентов задаёт приложение.
Поддержка TanStack Router вынесена в отдельную необязательную точку входа.

## Скелетон на основе компонента

```tsx
import { Skeleton } from 'loadshape';

type Post = { id: string; title: string; excerpt: string };

const PLACEHOLDER_POSTS: Post[] = [
  { id: 'placeholder-1', title: 'A typical article title', excerpt: 'A representative summary.' },
  { id: 'placeholder-2', title: 'Another article title', excerpt: 'A slightly longer summary.' },
];

export function PostList({ data, loading }: { data?: Post[]; loading: boolean }) {
  const posts = data ?? PLACEHOLDER_POSTS;

  return (
    <section aria-busy={loading || undefined}>
      <Skeleton.Root loading={loading}>
        <Skeleton.Static render={<h2 />}>Recent posts</Skeleton.Static>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </Skeleton.Root>
    </section>
  );
}
```

Приложение сохраняет состояния ошибки и пустого ответа и может показывать кешированные данные
во время фонового обновления. `loading` обозначает первый запрос. `Skeleton.Static` оставляет
видимым содержимое, известное до запроса, например заголовок секции. `aria-busy` размещается
на контейнере снаружи Root, поскольку на время загрузки Root получает inert.

Проп `render` применяет Root к существующему элементу, например `<ul />` или `<article />`.
[`Skeleton.Repeat`](packages/loadshape/README.ru.md#повторение-заглушек) повторяет заглушку
компонента несколько раз без дополнительной DOM-обёртки.

## Скелетоны в разных раскладках

Один и тот же Root может покрывать карточку профиля или страницу с боковой панелью и лентой.
Записи показывают переключение настоящих компонентов playground между загрузкой и контентом.

### Карточка профиля

![Карточка профиля переключается со скелетона на обложку, аватар, текст и кнопку](docs/assets/skeleton-card.gif)

[Исходник CardStand](apps/playground/src/pages/CardStand/index.tsx).
Компонент резервирует размеры обложки и аватара в своём CSS.

### Страница со статичным содержимым

![Боковая панель и лента переключаются со скелетона на контент; навигация и заголовок ленты остаются видимыми](docs/assets/skeleton-page.gif)

[Исходник PageStand](apps/playground/src/pages/PageStand/index.tsx).
Навигация находится за пределами Root, а `Skeleton.Static` сохраняет заголовок ленты внутри него.

## Цвета из приложения

Skeleton наследует `currentColor`, сохраняя фоны контейнеров, рамки, отступы и SVG-иконки.
На скриншоте один механизм работает на странице, карточке, тёмной секции и цветном баннере.

![Загрузка на светлом фоне, карточке, тёмной секции и синем баннере](docs/assets/surfaces.png)

[CSS-переменные](packages/loadshape/README.ru.md#css-переменные) связывают индикаторы с токенами приложения.
Все три компонента по умолчанию появляются через **150 мс**, чтобы короткие запросы не вызывали
мигания загрузки. Задержка настраивается, каждый компонент учитывает reduced-motion.

## Спиннеры в строке

Spinner наследует размер шрифта и цвет текста, поэтому подходит для кнопок, текста и разных фонов.

```tsx
import { Spinner } from 'loadshape';

export function SaveButton({ saving }: { saving: boolean }) {
  return (
    <>
      <button disabled={saving}>{saving && <Spinner />} Save changes</button>
      <span role="status">{saving ? 'Saving changes' : 'Ready'}</span>
    </>
  );
}
```

Кольцо имеет размер `1em`; зарезервированное место под иконку позволяет сохранить ширину кнопки.
Без подписи Spinner декоративный. Для отдельного статуса подходит
`<Spinner label="Loading the report" />`; особенности живых объявлений описаны в
[разделе доступности](packages/loadshape/README.ru.md#spinner).

## Прогресс навигации

RouteProgress показывает активность во время перехода. Полоса не изображает процент и скрывается
после завершения или отмены перехода.

Общий компонент принимает сигнал загрузки приложения:

```tsx
import { RouteProgress } from 'loadshape';

<RouteProgress pending={pending} className={styles.progress} />;
```

Приложение задаёт расположение, цвет и доступное сообщение о навигации.
[Адаптер TanStack Router](packages/loadshape/README.ru.md#tanstack-router) получает состояние
загрузки сам и сбрасывает задержку появления при смене адреса назначения:

```tsx
import { RouteProgress } from 'loadshape/tanstack-router';

<RouteProgress className={styles.progress} />;
```

Индикатор остаётся смонтированным в постоянной раскладке роутера. Адаптер требует необязательный
peer `@tanstack/react-router`; Skeleton, Spinner и общий RouteProgress работают без него.

## Playground

Playground находится в репозитории и использует версию pnpm, закреплённую в `package.json`:

```sh
git clone https://github.com/semyonsurkov/loadshape.git
cd loadshape
pnpm install
pnpm dev
```

Локальный адрес отображается в выводе Vite. В playground есть стенды списка, карточки, страницы,
разных фонов, пограничных случаев, спиннера и навигации. Кнопки стендов переключают загрузку
и контент; навигационный стенд содержит переходы длительностью 100 и 1200 мс.

Источники и параметры записей описаны в [заметках о медиа](docs/assets/README.ru.md).

Доступны запускаемые примеры для [TanStack Query](examples/tanstack-query/README.ru.md)
и [Next.js App Router](examples/nextjs/README.ru.md). Оба показывают загрузку, пустой ответ,
ошибку, отключённый запрос и фоновое обновление без внешнего API.

## API и границы

| Компонент                                                              | Назначение                                                  |
| ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Skeleton.Root](packages/loadshape/README.ru.md#root-и-static)         | Закрашивает отрисованное поддерево при loading=true.        |
| [Skeleton.Static](packages/loadshape/README.ru.md#root-и-static)       | Сохраняет содержимое, известное без запроса.                |
| [Skeleton.Repeat](packages/loadshape/README.ru.md#повторение-заглушек) | Повторяет функцию отрисовки без обёртки.                    |
| [Spinner](packages/loadshape/README.ru.md#spinner)                     | Показывает активность в размере и цвете окружающего текста. |
| [RouteProgress](packages/loadshape/README.ru.md#routeprogress)         | Показывает неопределённый прогресс перехода.                |

Пакет поставляет ES modules и декларации TypeScript. CSS использует слои, `:has()`, `color-mix()`
и маски. CommonJS и устаревшие CSS-движки находятся за пределами этой версии.
Запросы, ошибки, пустые ответы и выбор заглушек под неизвестный контент остаются у приложения.
[Описание совместимости и границ](packages/loadshape/README.ru.md#совместимость-и-границы) содержит сведения о поддерживаемых окружениях.

## Скилл интеграции

Руководство по интеграции устанавливается в каталог скиллов агента:

```sh
npx skills add semyonsurkov/loadshape --skill loadshape -a codex -y
```

Для других агентов доступен выбор в CLI. Скилл содержит примеры TanStack Query, подключения
существующих загрузчиков, Spinner и RouteProgress.

## Разработка и версии

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm exec prettier --check .
```

Доступны [документация проекта](docs/README.ru.md), [тесты](docs/testing.ru.md)
и [разработка и упаковка](docs/development.ru.md). Версии и changelog ведутся через Changesets;
изменение версии и упаковка выполняются отдельно от публикации.

Основной репозиторий находится на [GitHub](https://github.com/semyonsurkov/loadshape), зеркала на
[GitLab](https://gitlab.com/semyonsurkov/loadshape) и [GitVerse](https://gitverse.ru/semyonsurkov/loadshape).

[Лицензия MIT](LICENSE).
