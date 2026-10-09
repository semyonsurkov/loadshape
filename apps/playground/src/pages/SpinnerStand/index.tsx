import { Spinner } from 'loadshape';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

const TEXT_SIZES = [
  { id: 'small', label: 'Текст 14 px' },
  { id: 'base', label: 'Текст 16 px' },
  { id: 'large', label: 'Текст 24 px' },
  { id: 'title', label: 'Текст 32 px' },
] as const;

export function SpinnerStand() {
  return (
    <StandLayout title="Спиннер" isBusyRegion={false}>
      {(isLoading) => (
        <div className={styles.grid}>
          <section className={styles.case}>
            <h2 className={styles.case_title}>В кнопке вместо иконки</h2>
            <div className={styles.row}>
              <button
                className={styles.icon_button}
                type="button"
                aria-label="Обновить"
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
                Обновить список
              </button>
            </div>
          </section>

          <section className={styles.case}>
            <h2 className={styles.case_title}>В строке текста</h2>
            {TEXT_SIZES.map((size) => (
              <p key={size.id} className={styles.text} data-size={size.id}>
                {isLoading && <Spinner />} {size.label}
              </p>
            ))}
          </section>

          <section className={styles.case} data-surface="dark">
            <h2 className={styles.case_title}>Тёмная секция</h2>
            <p className={styles.text} data-size="base">
              {isLoading && <Spinner />} Сохраняем черновик
            </p>
          </section>

          <section className={styles.case} data-surface="accent">
            <h2 className={styles.case_title}>Цветной баннер</h2>
            <p className={styles.text} data-size="base">
              {isLoading && <Spinner />} Отправляем заявку
            </p>
          </section>

          <section className={styles.case}>
            <h2 className={styles.case_title}>Одиночный с подписью</h2>
            <div className={styles.slot}>
              {isLoading ? (
                <Spinner className={styles.large_spinner} label="Загружаем отчёт" />
              ) : (
                <p>Отчёт готов</p>
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
