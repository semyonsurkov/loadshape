# Spinner и RouteProgress

[English](indicators.md) · [Русский](indicators.ru.md)

Spinner наследует текущий цвет и размер 1em. Резервируй место под него, если ширина компонента
должна оставаться постоянной. Без label он декоративный; с label получает role=status и скрытый
текст. Для надёжного объявления держи живой регион смонтированным до обновления текста.
При reduced-motion вращение замедляется втрое.

Общий RouteProgress получает pending от любого роутера, остаётся смонтированным в постоянной
раскладке и показывает неопределённую активность. Приложение задаёт размещение, цвет, aria-busy
и доступный статус. Завершение и отмена сразу скрывают индикатор. Если новая операция заменяет
активную без промежуточного pending=false, передай новый React key для сброса задержки.

Адаптер `loadshape/tanstack-router` требует optional peer `@tanstack/react-router` версии
`^1.170.41` и размещения внутри RouterProvider; он сам получает pending и сбрасывает задержку
при изменении адреса. При reduced-motion полоса неподвижна и занимает полную ширину. Примеры,
CSS-переменные и детали доступны в [README пакета](https://github.com/semyonsurkov/loadshape/blob/main/packages/loadshape/README.ru.md#routeprogress).
