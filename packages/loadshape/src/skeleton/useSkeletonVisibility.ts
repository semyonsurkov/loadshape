import { useCallback, useEffect, useRef } from 'react';
import { observeVisibility } from './observeVisibility';

export function useSkeletonVisibility(loading: boolean): (element: HTMLElement | null) => void {
  const node = useRef<HTMLElement | null>(null);
  const enabled = useRef(false);
  const stop = useRef<(() => void) | undefined>(undefined);

  // Стабильный внутренний ref сохраняет подключение refs приложения при смене loading.
  const ref = useCallback((element: HTMLElement | null) => {
    stop.current?.();
    stop.current = undefined;
    node.current = element;
    if (element && enabled.current) stop.current = observeVisibility(element);
  }, []);

  useEffect(() => {
    enabled.current = loading;
    if (loading && node.current) stop.current = observeVisibility(node.current);
    return () => {
      enabled.current = false;
      stop.current?.();
      stop.current = undefined;
    };
  }, [loading]);

  return ref;
}
