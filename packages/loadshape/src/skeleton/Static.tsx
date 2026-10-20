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

export interface StaticProps extends HTMLAttributes<HTMLElement> {
  /** Элемент, который помечается статичным вместо обёртки, например render={<h2 />}. */
  render?: RenderElement;
  ref?: Ref<HTMLElement>;
}

const STATIC_STATE = { 'data-skeleton-static': '' } as const;

/**
 * Без render содержимое оборачивается в span с display: contents из styles.css: у такой обёртки
 * нет своего бокса, поэтому в потоке и во флексе раскладка вокруг статичного не меняется, а
 * className на ней задаёт только наследуемые свойства. Внутри table, thead, tbody, tr, ul и select
 * span ребёнком быть не может, там нужен render с элементом этого уровня, например
 * render={<thead />}.
 */
export const Static: ForwardRefExoticComponent<
  PropsWithoutRef<StaticProps> & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, StaticProps>(function Static(
  { render = <span data-skeleton-contents="" />, ...props }: StaticProps,
  ref,
): ReactElement {
  return useRenderElement(render, { ...props, ref }, STATIC_STATE);
});
