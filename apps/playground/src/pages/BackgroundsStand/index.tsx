import { Skeleton } from 'loadshape';
import { POSTS } from '../../shared/data/fixtures';
import { PostCard } from '../../shared/ui/PostCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

const SURFACES = [
  { id: 'page', label: 'Фон страницы' },
  { id: 'card', label: 'Карточка' },
  { id: 'dark', label: 'Тёмная секция' },
  { id: 'accent', label: 'Цветной баннер' },
] as const;

const [POST] = POSTS;

export function BackgroundsStand() {
  return (
    <StandLayout title="Разные фоны">
      {(isLoading) => (
        <div className={styles.grid}>
          {SURFACES.map((surface) => (
            <section key={surface.id} className={styles.surface} data-surface={surface.id}>
              <span className={styles.label}>{surface.label}</span>
              <Skeleton.Root loading={isLoading}>
                {surface.id === 'card' ? (
                  <PostCard post={POST} />
                ) : (
                  <div className={styles.bare}>
                    <h3 className={styles.title}>{POST.title}</h3>
                    <p className={styles.excerpt}>{POST.excerpt}</p>
                    <button className={styles.action} type="button">
                      Читать
                    </button>
                  </div>
                )}
              </Skeleton.Root>
            </section>
          ))}
        </div>
      )}
    </StandLayout>
  );
}
