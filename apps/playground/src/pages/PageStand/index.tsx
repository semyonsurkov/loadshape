import { Link } from '@tanstack/react-router';
import { Skeleton } from 'loadshape';
import { usePreviewData } from '../../shared/data/usePreviewData';
import { PostCard } from '../../shared/ui/PostCard';
import { ProfileCard } from '../../shared/ui/ProfileCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

export function PageStand() {
  const { posts, profile } = usePreviewData();
  return (
    <StandLayout allowTextLength title="Page">
      {(isLoading) => (
        <div className={styles.frame}>
          <header className={styles.topbar}>
            <span className={styles.brand}>Feed</span>
            <nav className={styles.nav}>
              <Link to="/stands/page" hash="feed">
                Home
              </Link>
              <Link to="/stands/page" hash="profile">
                Profile
              </Link>
            </nav>
          </header>
          <Skeleton.Root loading={isLoading} className={styles.content}>
            <aside id="profile">
              <ProfileCard profile={profile} />
            </aside>
            <main id="feed" className={styles.feed}>
              <Skeleton.Static render={<h2 className={styles.section_title} />}>
                Recent posts
              </Skeleton.Static>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </main>
          </Skeleton.Root>
        </div>
      )}
    </StandLayout>
  );
}
