import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { renderElement, type RenderElement } from '../utils/renderElement';

export interface SpinnerProps extends HTMLAttributes<HTMLElement> {
  /** Подпись для скринридера; без неё спиннер декоративный. */
  label?: string;
  /** Элемент, которым рисуется спиннер вместо span. */
  render?: RenderElement;
  ref?: Ref<HTMLElement>;
}

/**
 * Без label спиннер скрыт от скринридера: обычно он стоит в кнопке или контейнере, где загрузку
 * уже сообщает aria-busy, и второй сигнал был бы лишним. С label он становится role="status", а
 * подпись лежит визуально скрытым текстом внутри, потому что живой регион озвучивает содержимое,
 * а не aria-label. Смонтированный сразу с подписью регион скринридер может не объявить сам, тогда
 * подпись служит именем при навигации; для гарантированного объявления регион статуса держат в
 * разметке заранее.
 */
export function Spinner({ label, render = <span />, ...props }: SpinnerProps): ReactElement {
  if (!label) {
    return renderElement(render, props, { 'data-spinner': '', 'aria-hidden': true });
  }
  return renderElement(render, props, {
    'data-spinner': '',
    role: 'status',
    children: <span data-spinner-label="">{label}</span>,
  });
}
