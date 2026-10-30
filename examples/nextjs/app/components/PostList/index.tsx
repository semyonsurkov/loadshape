import { Skeleton } from 'loadshape';
import styles from './styles.module.css';

export type Post = { id: string; title: string; summary: string };

export function PostList({ posts, loading }: { posts: Post[]; loading: boolean }) {
  return (
    <section aria-busy={loading || undefined}>
      <Skeleton.Root loading={loading} render={<ul className={styles.list} />}>
        {posts.map((post) => (
          <li key={post.id}>
            <article className={styles.card}>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
            </article>
          </li>
        ))}
      </Skeleton.Root>
    </section>
  );
}
