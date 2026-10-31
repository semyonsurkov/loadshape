# loadshape

## 0.2.5

### Patch Changes

- Add a reproducible playground Card verification command with geometry, focus, retained evidence, isolated resources, and bilingual run instructions; the public API and runtime behavior are unchanged.

## 0.2.4

### Patch Changes

- Remove the recording caption and screenshot links from the package README.

## 0.2.3

### Patch Changes

- Refresh the package README with clearer component descriptions and a link to the project documentation, playground, and integration examples.

## 0.2.2

### Patch Changes

- Preserve nested static content inside loading controls and animate route progress correctly in RTL layouts.

## 0.2.1

### Patch Changes

- Update the package description and README with bilingual documentation, examples, screenshots, and skeleton demonstrations.

## 0.2.0

### Minor Changes

- ff154bc: Add React 18 support alongside React 19, preserving forwarded refs, callback cleanup, and inert loading roots.
- 6426e69: Add Skeleton.Repeat to render a placeholder template multiple times without extra DOM wrappers. The application keeps ownership of placeholder data, loading state, and layout.

## 0.1.0

### Minor Changes

- Первый публичный Skeleton для React 19: Root и Static с render и ref, заглушка из настоящего компонента, inert и CSS-переменные. В поставку входят ES modules, TypeScript declarations, отдельный CSS в @layer loadshape, примеры подключения и лицензия MIT. Скилл интеграции поставляется в репозитории отдельно от npm-пакета.
- b6e45b5: Добавлен RouteProgress с неопределённым прогрессом, общей задержкой появления и поддержкой reduced-motion. Отдельный импорт loadshape/tanstack-router подключает полосу к TanStack Router через optional peer; основной импорт библиотеки остаётся независимым от роутера.
- fc1e157: Добавлен Spinner с размером и цветом из окружения, пропами render и label и поддержкой reduced-motion. Переменная --loadshape_delay задаёт общую задержку появления Skeleton и Spinner; частные --skeleton_delay и --spinner_delay сохраняют приоритет.
