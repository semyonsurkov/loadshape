import type { Post } from '../api/posts';
import styles from './styles.module.css';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className={styles.card}>
      <h2>{post.title}</h2>
      <p>{post.summary}</p>
    </article>
  );
}
