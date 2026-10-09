import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { renderElement, type RenderElement } from '../utils/renderElement';

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
export function Static({
  render = <span data-skeleton-contents="" />,
  ...props
}: StaticProps): ReactElement {
  return renderElement(render, props, STATIC_STATE);
}
