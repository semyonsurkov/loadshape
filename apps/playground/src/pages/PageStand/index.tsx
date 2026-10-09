import { POSTS, PROFILE } from '../../shared/data/fixtures';
import { PostCard } from '../../shared/ui/PostCard';
import { ProfileCard } from '../../shared/ui/ProfileCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

export function PageStand() {
  return (
    <StandLayout title="Страница">
      {(isLoading) => (
        <div className={styles.frame}>
          <header className={styles.topbar}>
            <span className={styles.brand}>Лента</span>
            <nav className={styles.nav}>
              <a href="#feed">Главная</a>
              <a href="#profile">Профиль</a>
            </nav>
          </header>
          <div
            className={styles.content}
            data-skeleton={isLoading ? 'loading' : undefined}
            aria-busy={isLoading || undefined}
          >
            <aside>
              <ProfileCard profile={PROFILE} />
            </aside>
            <main className={styles.feed}>
              <h2 className={styles.section_title} data-skeleton-static>
                Свежие посты
              </h2>
              {POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </main>
          </div>
        </div>
      )}
    </StandLayout>
  );
}
