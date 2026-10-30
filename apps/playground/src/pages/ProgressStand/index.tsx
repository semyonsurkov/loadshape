import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { RouteProgress } from 'loadshape';
import { PreviewControls } from '../../shared/ui/PreviewControls';
import { usePreviewSettings } from '../../shared/ui/PreviewSettings/context';
import { FAST_LOAD_MS, SLOW_LOAD_MS } from './api/loadPage';
import styles from './styles.module.css';

const SPEEDS = [
  { speed: 'fast', title: 'Fast navigation', duration: FAST_LOAD_MS },
  { speed: 'slow', title: 'Slow navigation', duration: SLOW_LOAD_MS },
] as const;

export function ProgressStand() {
  const { width } = usePreviewSettings();
  const pending = useRouterState({ select: (state) => state.status === 'pending' });
  const destination = useRouterState({ select: (state) => state.location.href });

  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <Link className={styles.back} to="/">
          Examples
        </Link>
        <h1>Route progress</h1>
        <p className={styles.description}>
          Fast navigation takes 100 ms and slow navigation takes 1200 ms. The top bar uses the
          router, while the example receives the same pending state.
        </p>
      </header>

      <PreviewControls allowTextLength={false} />

      <nav className={styles.actions} aria-label="Page transitions">
        {SPEEDS.map((item) => (
          <Link
            key={item.speed}
            className={styles.action}
            to="/stands/progress/$speed"
            params={{ speed: item.speed }}
            search={(previous) => ({ run: (previous.run ?? 0) + 1 })}
            preload={false}
          >
            {item.title} ({item.duration} ms)
          </Link>
        ))}
        <Link
          className={styles.action}
          to="/stands/progress"
          search={(previous) => ({ run: (previous.run ?? 0) + 1 })}
          preload={false}
        >
          Cancel navigation
        </Link>
      </nav>

      <div
        className={styles.preview}
        style={width === 'full' ? undefined : { maxWidth: `${width}px` }}
      >
        <section className={styles.example} aria-labelledby="progress-example">
          <h2 id="progress-example">General component</h2>
          <div className={styles.track}>
            <RouteProgress key={destination} pending={pending} className={styles.inline_progress} />
          </div>
          <p role="status" className={styles.status}>
            {pending ? 'Loading the next page' : 'Navigation complete'}
          </p>
        </section>

        <section className={styles.destination} aria-busy={pending || undefined}>
          <Outlet />
        </section>
      </div>
    </main>
  );
}
