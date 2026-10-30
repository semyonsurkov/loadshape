import type { Profile } from '../../data/fixtures';
import styles from './styles.module.css';

const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <section className={styles.card}>
      <img className={styles.cover} src={profile.coverUrl} alt="" />
      <img className={styles.avatar} src={profile.avatarUrl} alt="" />
      <div className={styles.identity}>
        <h2 className={styles.name}>{profile.name}</h2>
        <span className={styles.handle}>{profile.handle}</span>
      </div>
      <p className={styles.bio}>{profile.bio}</p>
      <dl className={styles.stats}>
        <div className={styles.stat}>
          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          </svg>
          <dt className={styles.stat_label}>Followers</dt>
          <dd className={styles.stat_value}>{NUMBER_FORMAT.format(profile.followers)}</dd>
        </div>
        <div className={styles.stat}>
          <dt className={styles.stat_label}>Following</dt>
          <dd className={styles.stat_value}>{NUMBER_FORMAT.format(profile.following)}</dd>
        </div>
      </dl>
      <button className={styles.follow} type="button">
        Follow
      </button>
    </section>
  );
}
