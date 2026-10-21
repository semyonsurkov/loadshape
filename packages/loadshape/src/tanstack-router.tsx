import {
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  type ReactElement,
} from 'react';
import { useRouterState } from '@tanstack/react-router';
import {
  RouteProgress as Progress,
  type RouteProgressProps as ProgressProps,
} from './route-progress';

export type RouteProgressProps = Omit<ProgressProps, 'pending'>;

export const RouteProgress: ForwardRefExoticComponent<
  PropsWithoutRef<RouteProgressProps> & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, RouteProgressProps>(function RouteProgress(props, ref): ReactElement {
  const pending = useRouterState({ select: (state) => state.status === 'pending' });
  const destination = useRouterState({ select: (state) => state.location.href });
  // При замене активного перехода pending остаётся true, поэтому CSS-задержку сбрасывает ключ.
  return <Progress key={destination} {...props} ref={ref} pending={pending} />;
});
