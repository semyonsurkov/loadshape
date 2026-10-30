import { Spinner } from 'loadshape';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

const TEXT_SIZES = [
  { id: 'small', label: 'Text 14 px' },
  { id: 'base', label: 'Text 16 px' },
  { id: 'large', label: 'Text 24 px' },
  { id: 'title', label: 'Text 32 px' },
] as const;

export function SpinnerStand() {
  return (
    <StandLayout title="Spinner" isBusyRegion={false}>
      {(isLoading) => (
        <div className={styles.grid}>
          <section className={styles.case}>
            <h2 className={styles.case_title}>In a button instead of an icon</h2>
            <div className={styles.row}>
              <button
                className={styles.icon_button}
                type="button"
                aria-label="Refresh"
                aria-disabled={isLoading || undefined}
                aria-busy={isLoading || undefined}
              >
                {isLoading ? <Spinner /> : <RefreshIcon />}
              </button>
              <button
                className={styles.button}
                type="button"
                aria-disabled={isLoading || undefined}
                aria-busy={isLoading || undefined}
              >
                {isLoading ? <Spinner /> : <RefreshIcon />}
                Refresh list
              </button>
            </div>
          </section>

          <section className={styles.case}>
            <h2 className={styles.case_title}>Inline with text</h2>
            {TEXT_SIZES.map((size) => (
              <p key={size.id} className={styles.text} data-size={size.id}>
                {isLoading && <Spinner />} {size.label}
              </p>
            ))}
          </section>

          <section className={styles.case} data-surface="dark">
            <h2 className={styles.case_title}>Dark section</h2>
            <p className={styles.text} data-size="base">
              {isLoading && <Spinner />} Saving draft
            </p>
          </section>

          <section className={styles.case} data-surface="accent">
            <h2 className={styles.case_title}>Colored banner</h2>
            <p className={styles.text} data-size="base">
              {isLoading && <Spinner />} Submitting request
            </p>
          </section>

          <section className={styles.case}>
            <h2 className={styles.case_title}>Standalone with a label</h2>
            <div className={styles.slot}>
              {isLoading ? (
                <Spinner className={styles.large_spinner} label="Loading report" />
              ) : (
                <p>Report ready</p>
              )}
            </div>
          </section>
        </div>
      )}
    </StandLayout>
  );
}

function RefreshIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
    </svg>
  );
}
