# loadshape

[English](https://github.com/semyonsurkov/loadshape/blob/main/packages/loadshape/README.md) · [Русский](https://github.com/semyonsurkov/loadshape/blob/main/packages/loadshape/README.ru.md)

Состояния загрузки для React 18 и 19 на основе раскладки компонента и визуальных токенов приложения.
Skeleton закрашивает отрисованное содержимое, Spinner наследует размер и цвет,
а RouteProgress показывает активность навигации без выдуманного процента.

![Список переключается со скелетона на готовый контент](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton.gif)

В записи используются одинаковые данные в обоих состояниях, чтобы показать отрисованную геометрию.
Выбирай реалистичную длину заглушек и резервируй размеры изображений: библиотека не предсказывает
содержимое ответа.

[Скриншот загрузки](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton-loading.png) ·
[Скриншот контента](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton-content.png) ·
[Playground и исходники](https://github.com/semyonsurkov/loadshape/blob/main/README.ru.md#попробуй-playground)

## Установка

Нужны React 18 или 19.

```sh
pnpm add loadshape
```

Подключи CSS один раз в точке входа приложения:

```tsx
import 'loadshape/styles.css';
```

Стили находятся в `@layer loadshape`. Темы и внедрения стилей во время выполнения нет.
Основной импорт зависит только от React и не требует TanStack Router.

## Skeleton

Отрисовывай один компонент в обоих состояниях, передавая реалистичные заглушки на время загрузки:

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

Сохрани существующие ветки ошибки и пустого ответа. Подставные значения должны соответствовать
реальным типам и форматтерам, включая даты и enum. В TanStack Query передавай placeholderData
и используй isPlaceholderData как loading: подставные данные переводят запрос в success, поэтому
isPending=false. Сохраняй настоящий кешированный контент при фоновом обновлении и учитывай
отключённые запросы.

### Повторение заглушек

`Skeleton.Repeat` повторяет функцию отрисовки без DOM-обёртки:

```tsx
const PLACEHOLDER_COUNT = 8;
const PLACEHOLDER_POST = {
  title: 'A representative article title',
  excerpt: 'A typical summary with realistic length.',
};

<section aria-busy={loading || undefined}>
  <Skeleton.Root loading={loading} render={<ul className={styles.list} />}>
    {loading ? (
      <Skeleton.Repeat count={PLACEHOLDER_COUNT}>
        {(index) => (
          <li>
            <PostCard post={PLACEHOLDER_POST} position={index + 1} />
          </li>
        )}
      </Skeleton.Repeat>
    ) : (
      posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))
    )}
  </Skeleton.Root>
</section>;
```

Обязательный count принимает неотрицательное безопасное целое. Ноль ничего не рисует и не
вызывает children; некорректные значения приводят к RangeError. children(index) получает индекс
с нуля. Repeat задаёт стабильные позиционные ключи, поэтому заглушке не нужен собственный key.
Для настоящих данных сохраняй ключи сущностей в обычном map.

Repeat не включает загрузку, не выбирает данные, не создаёт элементы списка, не ставит aria-busy
и не задаёт раскладку или отступы. Это остаётся у приложения. Если повторяемый компонент уже
содержит Skeleton.Root, передавай loading ему вместо добавления ещё одного Root.

### Root и Static

| Компонент       | Пропсы                                                                      | Элемент по умолчанию     |
| --------------- | --------------------------------------------------------------------------- | ------------------------ |
| Skeleton.Root   | Обязательный loading: boolean, render, HTML-атрибуты, className, style, ref | div                      |
| Skeleton.Static | render, HTML-атрибуты, className, style, ref                                | span с display: contents |

Проп render применяет механизм к существующему элементу:

```tsx
<Skeleton.Root loading={loading} render={<table className={styles.table} />}>
  <Skeleton.Static render={<thead />}>
    <tr>
      <th>Name</th>
      <th>Total</th>
    </tr>
  </Skeleton.Static>
  <tbody>{rows}</tbody>
</Skeleton.Root>
```

В таблицах, списках и select передавай допустимые элементы: span по умолчанию там может нарушить
HTML. Пользовательские компоненты в render должны передавать HTML-атрибуты и ref своему DOM-корню.
В React 18 используй forwardRef; React 19 также поддерживает ref как проп.
Static сохраняет всё поддерево, поэтому помещай внутрь только известное без запроса.
Динамическое значение рядом со статичной подписью оборачивай в собственный элемент.
Статичный элемент на любой глубине текстового блока отключает его полосы, поскольку подчёркивание
предка прошло бы через статичный текст. Держи Static непосредственным ребёнком блока,
а динамические значения рядом помещай в отдельные элементы.

На загрузке Root получает inert. Ставь aria-busy на контейнере приложения снаружи Root:
inert убирает Root и потомков из фокуса и дерева доступности. Доступные во время загрузки
элементы управления, например отмена, должны находиться вне Root, даже если визуально статичны.

### Записи скелетонов

Карточка профиля резервирует размеры обложки и аватара в своём CSS:

![Карточка профиля переключается со скелетона на контент](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton-card.gif)

Страница может сохранить навигацию вне Root и известный заголовок ленты через Static:

![Боковая панель и лента переключаются со скелетона на контент со статичными навигацией и заголовком](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton-page.gif)

Во всех записях playground используются одинаковые данные в обоих состояниях.

### Атрибуты

| Атрибут                 | Назначение                                           |
| ----------------------- | ---------------------------------------------------- |
| data-skeleton="loading" | Включает закраску загрузки на Root.                  |
| data-skeleton-static    | Сохраняет поддерево, известное без запроса.          |
| data-skeleton-bone      | Делает намеренно пустой элемент плашкой.             |
| data-skeleton-contents  | Задаёт display:contents обёртке Static по умолчанию. |

Skeleton закрашивает строки текста, медиа и элементы управления. Фоны контейнеров, рамки,
отступы и SVG-иконки остаются видимыми. Сохраняется геометрия отрисованного дерева, но неизвестная
длина текста и количество строк ответа не предсказываются.

Задавай изображениям размеры или aspect-ratio. Поля, select и кнопки должны иметь оформление
приложения: закраска неоформленного нативного элемента может изменить его размер в WebKit.
График, целиком состоящий из SVG, требует собственного представления загрузки в приложении.

## Фоны

Skeleton использует цвет окружающего текста, сохраняя фоны и рамки контейнеров.
Один компонент работает на светлых, тёмных и цветных поверхностях с токенами приложения.

![Загрузка на странице, карточке, тёмной секции и цветном баннере](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/surfaces.png)

## Spinner

```tsx
import { Spinner } from 'loadshape';

<Spinner />;
<Spinner label="Loading the report" />;
```

Spinner по умолчанию рисует span и принимает label, render, HTML-атрибуты, className, style и ref.
Кольцо имеет размер 1em и цвет currentColor. Резервируй место или совпадай с размером заменяемой
иконки, чтобы сохранить раскладку. Индикатор появляется после общей задержки; reduced-motion
замедляет вращение втрое.

Без label индикатор декоративный (aria-hidden). С label он получает role=status и визуально
скрытый текст. Монтирование живого региона сразу с текстом не гарантирует объявления;
если оно необходимо, сохраняй регион статуса смонтированным до изменения его текста.

## RouteProgress

Общий компонент работает с любым роутером или сигналом загрузки навигации:

```tsx
import { RouteProgress } from 'loadshape';

<RouteProgress pending={pending} className={styles.progress} />;
```

По умолчанию рисует div и принимает обязательный pending, render, HTML-атрибуты, className,
style и ref. Оставляй его смонтированным в раскладке навигации. Расположение, ширина, порядок
наложения, цвет и доступное сообщение принадлежат приложению. В обычном потоке скрытый индикатор
сохраняет высоту. Завершение и отмена скрывают его сразу. Reduced-motion показывает неподвижную
полосу на всю ширину.

Если новая операция заменяет активную без промежуточного false, передавай общий компонент
с новым React key, чтобы перезапустить задержку появления.

### TanStack Router

Установи необязательный peer @tanstack/react-router совместимой версии ^1.170.41 и помести
адаптер в постоянную корневую раскладку внутри RouterProvider:

```tsx
import { Outlet } from '@tanstack/react-router';
import { RouteProgress } from 'loadshape/tanstack-router';

function RootLayout() {
  return (
    <>
      <RouteProgress className={styles.progress} />
      <Outlet />
    </>
  );
}
```

Адаптер сам получает pending и сбрасывает задержку при смене href назначения. Остальные пропсы
совпадают с общим компонентом. Оба варианта декоративные; aria-busy и доступное сообщение
о навигации остаются у приложения.

## CSS-переменные

Переопредели переменные через токены приложения:

```css
.progress {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  color: var(--accent);
  --route_progress_thickness: var(--spacing_half);
}
```

| Переменная                 | По умолчанию                                       |
| -------------------------- | -------------------------------------------------- |
| --loadshape_delay          | 150ms                                              |
| --skeleton_delay           | Общая задержка                                     |
| --skeleton_color           | color-mix(in oklab, currentColor 14%, transparent) |
| --skeleton_duration        | 1.4s                                               |
| --skeleton_shimmer_opacity | 0.35                                               |
| --spinner_delay            | Общая задержка                                     |
| --spinner_size             | 1em                                                |
| --spinner_thickness        | 0.125em                                            |
| --spinner_duration         | 0.8s                                               |
| --route_progress_delay     | Общая задержка                                     |
| --route_progress_thickness | 0.125em                                            |
| --route_progress_duration  | 1.4s                                               |

Задержки компонентов имеют приоритет над общей. Все три индикатора появляются с задержкой,
чтобы короткие загрузки не мигали. Reduced-motion останавливает shimmer скелетона.
Переменные с префиксом --_ являются внутренними.

## Совместимость и границы

Обе JavaScript-точки входа поставляют ES modules и декларации TypeScript. CSS подключается
отдельно. CommonJS и устаревшие CSS-движки находятся за пределами этой версии.
Стили используют слои, :has(), color-mix(), маски и свойство rotate. Проверки охватывают текущие
Chromium и WebKit, без обещания поддержки всех версий браузеров и скринридеров.

Библиотека предоставляет закраску загрузки и индикаторы. Запросы, ошибки, пустые ответы,
визуальные токены и выбор заглушек для неизвестного контента остаются у приложения.

## Локальная копия

Чтобы попробовать неопубликованную сборку, упакуй библиотеку и установи архив:

```sh
pnpm --filter loadshape build
pnpm --filter loadshape pack --pack-destination /tmp
LOADSHAPE_VERSION=$(node -p "require('./packages/loadshape/package.json').version")
# In the consuming application, using the same terminal:
pnpm add "/tmp/loadshape-$LOADSHAPE_VERSION.tgz"
```

Используй pnpm: npm не применяет publishConfig.exports, оставляет условие source и не включает
лицензию в архив.

Лицензия: MIT.
