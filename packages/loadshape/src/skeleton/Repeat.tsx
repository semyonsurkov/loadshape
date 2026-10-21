import { Fragment, type ReactElement, type ReactNode } from 'react';

export interface RepeatProps {
  /** Количество повторений; неотрицательное безопасное целое число. */
  count: number;
  /** Шаблон элемента. Получает индекс от нуля; данные и loading задаёт приложение. */
  children: (index: number) => ReactNode;
}

/** Повторяет шаблон со стабильными ключами без дополнительных DOM-элементов. */
export function Repeat({ count, children }: RepeatProps): ReactElement {
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new RangeError('Skeleton.Repeat count must be a non-negative safe integer.');
  }

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <Fragment key={index}>{children(index)}</Fragment>
      ))}
    </>
  );
}
