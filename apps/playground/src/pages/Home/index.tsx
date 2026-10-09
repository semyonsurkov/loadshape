import { Link } from '@tanstack/react-router';
import styles from './styles.module.css';

const STANDS = [
  { to: '/stands/list', title: 'Список' },
  { to: '/stands/card', title: 'Карточка' },
  { to: '/stands/page', title: 'Страница' },
  { to: '/stands/backgrounds', title: 'Разные фоны' },
  { to: '/stands/edges', title: 'Края' },
  { to: '/stands/spinner', title: 'Спиннер' },
] as const;

export function Home() {
  return (
    <main className={styles.page}>
      <h1>loadshape</h1>
      <nav className={styles.stands}>
        {STANDS.map((stand) => (
          <Link key={stand.to} className={styles.stand} to={stand.to}>
            {stand.title}
          </Link>
        ))}
      </nav>
    </main>
  );
}
