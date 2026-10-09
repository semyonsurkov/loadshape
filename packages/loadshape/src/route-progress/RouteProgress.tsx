import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { renderElement, type RenderElement } from '../utils/renderElement';

export interface RouteProgressProps extends HTMLAttributes<HTMLElement> {
  pending: boolean;
  render?: RenderElement;
  ref?: Ref<HTMLElement>;
}

export function RouteProgress({
  pending,
  render = <div />,
  ...props
}: RouteProgressProps): ReactElement {
  return renderElement(render, props, {
    'data-route-progress': pending ? 'pending' : '',
    'aria-hidden': true,
  });
}
