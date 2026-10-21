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

export interface RouteProgressProps extends HTMLAttributes<HTMLElement> {
  pending: boolean;
  render?: RenderElement;
  ref?: Ref<HTMLElement>;
}

export const RouteProgress: ForwardRefExoticComponent<
  PropsWithoutRef<RouteProgressProps> & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, RouteProgressProps>(function RouteProgress(
  { pending, render = <div />, ...props }: RouteProgressProps,
  ref,
): ReactElement {
  return useRenderElement(
    render,
    { ...props, ref },
    {
      'data-route-progress': pending ? 'pending' : '',
      'aria-hidden': true,
    },
  );
});
