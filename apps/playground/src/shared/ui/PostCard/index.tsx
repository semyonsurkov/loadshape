import type { Post } from '../../data/fixtures';
import styles from './styles.module.css';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className={styles.card}>
      <img className={styles.avatar} src={post.avatarUrl} alt="" />
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.author}>{post.author}</span>
          <time className={styles.time}>{post.readingTime}</time>
          <span className={styles.tag}>{post.tag}</span>
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <button className={styles.action} type="button">
          Читать
        </button>
      </div>
    </article>
  );
}
