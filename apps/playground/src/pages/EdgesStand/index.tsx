import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

const COVER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='120'%3E%3Crect fill='%232b59ff' width='320' height='120'/%3E%3C/svg%3E";

export function EdgesStand() {
  return (
    <StandLayout title="Края">
      {(isLoading) => {
        const skeleton = isLoading ? 'loading' : undefined;
        return (
          <div className={styles.grid}>
            <section className={styles.case}>
              <h2 className={styles.case_title}>Корень строчный и корень-кнопка</h2>
              <p>
                Итого:{' '}
                <span
                  className={styles.price}
                  data-skeleton={skeleton}
                  aria-busy={isLoading || undefined}
                >
                  1 280 ₽
                </span>
              </p>
              <button
                className={styles.action}
                type="button"
                data-skeleton={skeleton}
                aria-busy={isLoading || undefined}
              >
                Купить за 1 280 ₽
              </button>
            </section>

            <section
              className={styles.case}
              data-skeleton={skeleton}
              aria-busy={isLoading || undefined}
            >
              <h2 className={styles.case_title}>Ссылки и строчные внутри текста</h2>
              <p className={styles.static_note} data-skeleton-static>
                Условия доставки <a href="#edges">подробнее</a>, <s>до пятницы</s>
              </p>
              <p>
                Цена указана <a href="#edges">по ссылке</a>, <s>старая 1 500 ₽</s> и{' '}
                <strong>новая 1 280 ₽</strong> со скидкой до конца недели.
              </p>
              <label className={styles.check}>
                <input type="checkbox" /> Запомнить меня
              </label>
            </section>

            <section
              className={styles.case}
              data-skeleton={skeleton}
              aria-busy={isLoading || undefined}
            >
              <h2 className={styles.case_title}>Поля с оформлением проекта</h2>
              <select className={styles.field}>
                <option>Москва</option>
              </select>
              <input className={styles.field} type="search" placeholder="Поиск по каталогу" />
              <textarea className={styles.field} rows={2} defaultValue="Комментарий к заказу" />
              <button className={styles.field} type="button">
                Отправить
              </button>
            </section>

            <section
              className={styles.case}
              data-skeleton={skeleton}
              aria-busy={isLoading || undefined}
            >
              <h2 className={styles.case_title}>Картинка в picture и разделитель</h2>
              <picture className={styles.picture}>
                <img className={styles.cover} src={COVER_SRC} alt="" />
              </picture>
              <hr className={styles.divider} />
              <p>Текст под разделителем в одну строку.</p>
            </section>
          </div>
        );
      }}
    </StandLayout>
  );
}
