import {
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from 'react';
import { useRenderElement, type RenderElement } from '../utils/useRenderElement';

/**
 * children не принимаются: с label содержимым элемента становится визуально скрытая подпись, и
 * переданные children молча терялись бы.
 */
export interface SpinnerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
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
export const Spinner: ForwardRefExoticComponent<
  PropsWithoutRef<SpinnerProps> & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, SpinnerProps>(function Spinner(
  { label, render = <span />, ...props }: SpinnerProps,
  ref,
): ReactElement {
  return useRenderElement(
    render,
    { ...props, ref },
    label
      ? {
          'data-spinner': '',
          role: 'status',
          children: <span data-spinner-label="">{label}</span>,
        }
      : { 'data-spinner': '', 'aria-hidden': true },
  );
});
