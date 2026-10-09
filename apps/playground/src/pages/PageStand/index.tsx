import { Skeleton } from 'loadshape';
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
          <Skeleton.Root loading={isLoading} className={styles.content}>
            <aside>
              <ProfileCard profile={PROFILE} />
            </aside>
            <main className={styles.feed}>
              <Skeleton.Static render={<h2 className={styles.section_title} />}>
                Свежие посты
              </Skeleton.Static>
              {POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </main>
          </Skeleton.Root>
        </div>
      )}
    </StandLayout>
  );
}
