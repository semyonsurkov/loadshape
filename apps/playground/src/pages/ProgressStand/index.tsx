import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { RouteProgress } from 'loadshape';
import { FAST_LOAD_MS, SLOW_LOAD_MS } from './api/loadPage';
import styles from './styles.module.css';

const SPEEDS = [
  { speed: 'fast', title: 'Быстрый переход', duration: FAST_LOAD_MS },
  { speed: 'slow', title: 'Медленный переход', duration: SLOW_LOAD_MS },
] as const;

export function ProgressStand() {
  const pending = useRouterState({ select: (state) => state.status === 'pending' });

  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <Link className={styles.back} to="/">
          Стенды
        </Link>
        <h1>Полоса перехода</h1>
        <p className={styles.description}>
          Быстрый переход занимает 100 мс, медленный 1200 мс. Полоса наверху подключена к роутеру,
          полоса в примере получает тот же флаг загрузки через pending.
        </p>
      </header>

      <nav className={styles.actions} aria-label="Переходы между страницами">
        {SPEEDS.map((item) => (
          <Link
            key={item.speed}
            className={styles.action}
            to="/stands/progress/$speed"
            params={{ speed: item.speed }}
            search={(previous) => ({ run: (previous.run ?? 0) + 1 })}
            preload={false}
          >
            {item.title} ({item.duration} мс)
          </Link>
        ))}
        <Link
          className={styles.action}
          to="/stands/progress"
          search={(previous) => ({ run: (previous.run ?? 0) + 1 })}
          preload={false}
        >
          Отменить переход
        </Link>
      </nav>

      <section className={styles.example} aria-labelledby="progress-example">
        <h2 id="progress-example">Общий компонент</h2>
        <div className={styles.track}>
          <RouteProgress pending={pending} className={styles.inline_progress} />
        </div>
        <p role="status" className={styles.status}>
          {pending ? 'Загружаем следующую страницу' : 'Переход завершён'}
        </p>
      </section>

      <section className={styles.destination} aria-busy={pending || undefined}>
        <Outlet />
      </section>
    </main>
  );
}
