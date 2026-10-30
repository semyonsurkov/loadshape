import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { PreviewControls } from '../PreviewControls';
import { usePreviewSettings } from '../PreviewSettings/context';
import styles from './styles.module.css';

type StandLayoutProps = {
  title: string;
  /** Ставить ли aria-busy на всю область стенда; стенд спиннера расставляет его сам. */
  isBusyRegion?: boolean;
  allowTextLength?: boolean;
  children: (isLoading: boolean) => ReactNode;
};

// Быстрее общей задержки появления 150 ms: на такой загрузке ни заглушка, ни спиннер не должны
// мигнуть, и стенд это показывает
const FAST_LOAD_MS = 100;

export function StandLayout({
  title,
  isBusyRegion = true,
  allowTextLength = false,
  children,
}: StandLayoutProps) {
  const { width } = usePreviewSettings();
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
            Examples
          </Link>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.actions}>
          <button className={styles.toggle} type="button" onClick={handleFastLoad}>
            Fast load
          </button>
          <button className={styles.toggle} type="button" onClick={() => setIsLoading((v) => !v)}>
            {isLoading ? 'Show content' : 'Show loading'}
          </button>
        </div>
      </header>
      <PreviewControls allowTextLength={allowTextLength} />
      <div
        className={styles.content}
        style={width === 'full' ? undefined : { maxWidth: `${width}px` }}
        aria-busy={(isBusyRegion && isLoading) || undefined}
      >
        {children(isLoading)}
      </div>
    </div>
  );
}
