import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import styles from './styles.module.css';

type StandLayoutProps = {
  title: string;
  /** Ставить ли aria-busy на всю область стенда; стенд спиннера расставляет его сам. */
  isBusyRegion?: boolean;
  children: (isLoading: boolean) => ReactNode;
};

// Быстрее общей задержки появления 150 мс: на такой загрузке ни заглушка, ни спиннер не должны
// мигнуть, и стенд это показывает
const FAST_LOAD_MS = 100;

export function StandLayout({ title, isBusyRegion = true, children }: StandLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const fastLoadTimer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(fastLoadTimer.current), []);

  const handleFastLoad = () => {
    window.clearTimeout(fastLoadTimer.current);
    setIsLoading(true);
    fastLoadTimer.current = window.setTimeout(() => setIsLoading(false), FAST_LOAD_MS);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <Link className={styles.back} to="/">
            Стенды
          </Link>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.actions}>
          <button className={styles.toggle} type="button" onClick={handleFastLoad}>
            Быстрая загрузка
          </button>
          <button className={styles.toggle} type="button" onClick={() => setIsLoading((v) => !v)}>
            {isLoading ? 'Показать контент' : 'Показать загрузку'}
          </button>
        </div>
      </header>
      <div className={styles.content} aria-busy={(isBusyRegion && isLoading) || undefined}>
        {children(isLoading)}
      </div>
    </div>
  );
}
