import type { ReactElement } from 'react';
import { useRouterState } from '@tanstack/react-router';
import {
  RouteProgress as Progress,
  type RouteProgressProps as ProgressProps,
} from './route-progress';

export type RouteProgressProps = Omit<ProgressProps, 'pending'>;

export function RouteProgress(props: RouteProgressProps): ReactElement {
  const pending = useRouterState({ select: (state) => state.status === 'pending' });
  return <Progress {...props} pending={pending} />;
}
