import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { renderElement, type RenderElement } from '../utils/renderElement';

export interface RootProps extends HTMLAttributes<HTMLElement> {
  /** Пока true, поддерево рисуется заглушкой той же геометрии. */
  loading: boolean;
  /** Элемент, которым рисуется корень вместо div, например render={<ul />}. */
  render?: RenderElement;
  ref?: Ref<HTMLElement>;
}

const LOADING_STATE = {
  'data-skeleton': 'loading',
  inert: true,
} as const;

/**
 * На время загрузки корень получает inert: заглушка не берёт фокус и не читается скринридером.
 * inert убирает из дерева доступности и сам корень, поэтому aria-busy на нём никто бы не
 * услышал; aria-busy ставит проект на свой контейнер вокруг корня.
 */
export function Root({ loading, render = <div />, ...props }: RootProps): ReactElement {
  return renderElement(render, props, loading ? LOADING_STATE : {});
}
