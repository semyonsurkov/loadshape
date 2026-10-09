import { POSTS } from '../../shared/data/fixtures';
import { PostCard } from '../../shared/ui/PostCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

export function ListStand() {
  return (
    <StandLayout title="Список">
      {(isLoading) => (
        <ul
          className={styles.list}
          data-skeleton={isLoading ? 'loading' : undefined}
          aria-busy={isLoading || undefined}
        >
          {POSTS.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </StandLayout>
  );
}
