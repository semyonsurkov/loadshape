import { Skeleton } from 'loadshape';
import { usePreviewData } from '../../shared/data/usePreviewData';
import { PostCard } from '../../shared/ui/PostCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

export function ListStand() {
  const { posts } = usePreviewData();
  return (
    <StandLayout allowTextLength title="List">
      {(isLoading) => (
        <Skeleton.Root loading={isLoading} render={<ul className={styles.list} />}>
          {isLoading ? (
            <Skeleton.Repeat count={posts.length}>
              {(index) => (
                <li>
                  <PostCard post={posts[index]} />
                </li>
              )}
            </Skeleton.Repeat>
          ) : (
            posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))
          )}
        </Skeleton.Root>
      )}
    </StandLayout>
  );
}
