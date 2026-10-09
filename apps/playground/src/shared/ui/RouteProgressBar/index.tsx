import { RouteProgress, type RouteProgressProps } from 'loadshape/tanstack-router';
import styles from './styles.module.css';

export function RouteProgressBar({ className, ...props }: RouteProgressProps) {
  return (
    <RouteProgress {...props} className={[styles.progress, className].filter(Boolean).join(' ')} />
  );
}
