import {
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from 'react';
import { useSkeletonVisibility } from './useSkeletonVisibility';
import { IS_REACT_19 } from '../utils/reactVersion';
import { useRenderElement, type RenderElement } from '../utils/useRenderElement';

export interface RootProps extends HTMLAttributes<HTMLElement> {
  /** Пока true, поддерево рисуется заглушкой той же геометрии. */
  loading: boolean;
  /** Элемент, которым рисуется корень вместо div, например render={<ul />}. */
  render?: RenderElement;
  ref?: Ref<HTMLElement>;
}

const LOADING_STATE = {
  'data-skeleton': 'loading',
  inert: IS_REACT_19 ? true : '',
} as const;

/**
 * На время загрузки корень получает inert: заглушка не берёт фокус и не читается скринридером.
 * inert убирает из дерева доступности и сам корень, поэтому aria-busy на нём никто бы не
 * услышал; aria-busy ставит проект на свой контейнер вокруг корня.
 */
export const Root: ForwardRefExoticComponent<
  PropsWithoutRef<RootProps> & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, RootProps>(function Root(
  { loading, render = <div />, ...props }: RootProps,
  ref,
): ReactElement {
  const visibilityRef = useSkeletonVisibility(loading);
  return useRenderElement(render, { ...props, ref }, loading ? LOADING_STATE : {}, visibilityRef);
});
