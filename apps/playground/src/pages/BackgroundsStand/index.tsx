import { Skeleton } from 'loadshape';
import { usePreviewData } from '../../shared/data/usePreviewData';
import { PostCard } from '../../shared/ui/PostCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

const SURFACES = [
  { id: 'page', label: 'Page background' },
  { id: 'card', label: 'Card' },
  { id: 'dark', label: 'Dark section' },
  { id: 'accent', label: 'Colored banner' },
] as const;

export function BackgroundsStand() {
  const { posts } = usePreviewData();
  return (
    <StandLayout allowTextLength title="Different surfaces">
      {(isLoading) => (
        <div className={styles.grid}>
          {SURFACES.map((surface) => (
            <section key={surface.id} className={styles.surface} data-surface={surface.id}>
              <span className={styles.label}>{surface.label}</span>
              <Skeleton.Root loading={isLoading}>
                {surface.id === 'card' ? (
                  <PostCard post={posts[0]} />
                ) : (
                  <div className={styles.bare}>
                    <h3 className={styles.title}>{posts[0].title}</h3>
                    <p className={styles.excerpt}>{posts[0].excerpt}</p>
                    <button className={styles.action} type="button">
                      Read
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
