import { Skeleton } from 'loadshape';
import { POSTS } from '../../shared/data/fixtures';
import { PostCard } from '../../shared/ui/PostCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

export function ListStand() {
  return (
    <StandLayout title="Список">
      {(isLoading) => (
        <Skeleton.Root loading={isLoading} render={<ul className={styles.list} />}>
          {POSTS.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </Skeleton.Root>
      )}
    </StandLayout>
  );
}
