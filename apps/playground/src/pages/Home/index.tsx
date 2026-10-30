import { Link } from '@tanstack/react-router';
import styles from './styles.module.css';

const STANDS = [
  { to: '/stands/list', title: 'List' },
  { to: '/stands/card', title: 'Card' },
  { to: '/stands/page', title: 'Page' },
  { to: '/stands/backgrounds', title: 'Different surfaces' },
  { to: '/stands/edges', title: 'Edge cases' },
  { to: '/stands/spinner', title: 'Spinner' },
  { to: '/stands/progress', title: 'Route progress' },
] as const;

export function Home() {
  return (
    <main className={styles.page}>
      <h1>loadshape</h1>
      <p className={styles.description}>
        Explore loading states built from real React components. Choose a stand to compare its
        skeleton and content, adjust the preview, and see how it responds to different layouts.
      </p>
      <div className={styles.links}>
        <a href="https://github.com/semyonsurkov/loadshape">GitHub</a>
        <a href="https://www.npmjs.com/package/loadshape">npm package</a>
        <a href="https://github.com/semyonsurkov/loadshape/tree/main/examples/tanstack-query">
          TanStack Query example
        </a>
        <a href="https://github.com/semyonsurkov/loadshape/tree/main/examples/nextjs">
          Next.js example
        </a>
      </div>
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
