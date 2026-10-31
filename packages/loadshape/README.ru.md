# loadshape

[English](https://github.com/semyonsurkov/loadshape/blob/main/packages/loadshape/README.md) · [Русский](https://github.com/semyonsurkov/loadshape/blob/main/packages/loadshape/README.ru.md)

**CSS-скелетоны из существующих React-компонентов.**

`Skeleton.Root` закрашивает текст, медиа и элементы управления, уже отрисованные компонентом.
На время загрузки приложение подставляет типичные данные; компонент сохраняет свою раскладку
и оформление. В библиотеку также входят строчный `Spinner` и `RouteProgress`.

- **Дочернее дерево остаётся смонтированным.** Изменение `loading` у Root сохраняет его детей
  без второй копии для измерений. Состояние подчиняется обычным правилам React: смена ключей,
  типов компонентов или условных веток может его сбросить.
- **Используется существующая раскладка браузера.** CSS рисует заглушку без измерения отдельных
  элементов контента через JavaScript и построения отдельного дерева плашек. Текстовые полосы
  следуют реальным переносам строк.
- **Взаимодействие блокируется на время загрузки.** Root получает `inert`, который исключает
  поддерево из фокуса и дерева доступности. `aria-busy` и доступные во время загрузки кнопки
  размещаются снаружи Root.
- **Оформление приходит из приложения.** Цвет заглушки выводится из окружающего текста,
  фоны и рамки контейнеров остаются видимыми. Мерцание скелетона отключается при reduced motion.

Нужны React 18 или 19 и современный CSS. Раскладку загрузки определяют подставные данные;
настоящие строки и количество записей могут её изменить. Изображениям резервируются размеры,
нативным полям задаются стили. Механизм не гарантирует нулевых сдвигов или меньшей стоимости рендеринга.

На время загрузки Root использует общий для документа `IntersectionObserver` и приостанавливает
мерцание, когда его бокс находится вне области просмотра. При прокрутке к корню анимация
возобновляется; задержка появления продолжает идти независимо. Наблюдатель отслеживает видимость
без построения геометрии заглушки. Серверная разметка, браузеры без наблюдателя и корни без
измеримого бокса, например `display: contents`, сохраняют CSS-анимацию. Использование CSS-атрибутов
напрямую без `Skeleton.Root` не включает отслеживание видимости. Длинный Root, который ещё
пересекает область просмотра, продолжает мерцание всех потомков, включая находящиеся вне экрана.

![Список переключается со скелетона на готовый контент](https://raw.githubusercontent.com/semyonsurkov/loadshape/main/docs/assets/skeleton.gif)

## Установка

Нужны React 18 или 19.

```sh
pnpm add loadshape
```

CSS подключается один раз в точке входа приложения:

```tsx
import 'loadshape/styles.css';
```

Стили находятся в `@layer loadshape`. Темы и внедрения стилей во время выполнения нет.
Основной импорт зависит только от React и не требует TanStack Router.

## Skeleton

Один компонент отображается в обоих состояниях с подставными данными на время загрузки:

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

Приложение сохраняет ветки ошибки и пустого ответа. Подставные значения должны соответствовать
реальным типам и форматтерам, включая даты и enum. В TanStack Query placeholderData задаёт
подставные данные, а isPlaceholderData передаётся в loading: запрос с такими данными находится
в состоянии success, поэтому isPending=false. При фоновом обновлении кешированные данные могут
оставаться видимыми; поведение отключённых запросов сохраняется.

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
Для настоящих данных обычный map использует ключи сущностей.

Repeat не включает загрузку, не выбирает данные, не создаёт элементы списка, не ставит aria-busy
и не задаёт раскладку или отступы. Это остаётся у приложения. Если повторяемый компонент уже
содержит Skeleton.Root, состояние задаётся его пропом loading без дополнительного Root.

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

В таблицах, списках и select требуются допустимые дочерние элементы: span по умолчанию может
нарушить HTML. Пользовательские компоненты в render должны передавать HTML-атрибуты и ref
DOM-корню. В React 18 для этого применяется forwardRef; React 19 также поддерживает ref как проп.
Static сохраняет всё поддерево, поэтому оно содержит только известное без запроса. Динамическое
значение рядом со статичной подписью размещается в отдельном элементе. Статичный элемент на
любой глубине текстового блока отключает его полосы, поскольку подчёркивание предка прошло бы
через статичный текст. Static размещается непосредственным ребёнком блока, динамические значения
рядом находятся в отдельных элементах.

На загрузке Root получает inert, а aria-busy размещается на контейнере приложения снаружи Root:
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

Изображения требуют заданных размеров или aspect-ratio. Поля, select и кнопки должны иметь оформление
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
Кольцо имеет размер 1em и цвет currentColor. Зарезервированное место или равный размер заменяемой
иконки позволяют сохранить раскладку. Индикатор появляется после общей задержки; reduced-motion
замедляет вращение втрое.

Без label индикатор декоративный (aria-hidden). С label он получает role=status и визуально
скрытый текст. Монтирование живого региона сразу с текстом не гарантирует объявления;
если оно необходимо, регион статуса остаётся смонтированным до изменения текста.

## RouteProgress

Общий компонент работает с любым роутером или сигналом загрузки навигации:

```tsx
import { RouteProgress } from 'loadshape';

<RouteProgress pending={pending} className={styles.progress} />;
```

По умолчанию рисует div и принимает обязательный pending, render, HTML-атрибуты, className,
style и ref. Компонент остаётся смонтированным в раскладке навигации. Расположение, ширина, порядок
наложения, цвет и доступное сообщение принадлежат приложению. В обычном потоке скрытый индикатор
сохраняет высоту. Завершение и отмена скрывают его сразу. Reduced-motion показывает неподвижную
полосу на всю ширину.

Если новая операция заменяет активную без промежуточного false, новый React key общего
компонента перезапускает задержку появления.

### TanStack Router

Адаптер требует необязательный peer @tanstack/react-router совместимой версии ^1.170.41
и размещается в постоянной корневой раскладке внутри RouterProvider:

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

CSS-переменные могут ссылаться на токены приложения:

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

Неопубликованная сборка упаковывается и устанавливается из локального архива:

```sh
pnpm --filter loadshape build
pnpm --filter loadshape pack --pack-destination /tmp
LOADSHAPE_VERSION=$(node -p "require('./packages/loadshape/package.json').version")
# In the consuming application, using the same terminal:
pnpm add "/tmp/loadshape-$LOADSHAPE_VERSION.tgz"
```

Для упаковки используется pnpm: npm не применяет publishConfig.exports, оставляет условие source
и не включает лицензию в архив.

Лицензия: MIT.
