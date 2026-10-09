import { useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import styles from './styles.module.css';

type StandLayoutProps = {
  title: string;
  children: (isLoading: boolean) => ReactNode;
};

export function StandLayout({ title, children }: StandLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <Link className={styles.back} to="/">
            Стенды
          </Link>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <button className={styles.toggle} type="button" onClick={() => setIsLoading((v) => !v)}>
          {isLoading ? 'Показать контент' : 'Показать загрузку'}
        </button>
      </header>
      {children(isLoading)}
    </div>
  );
}
