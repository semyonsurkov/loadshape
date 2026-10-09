import { PROFILE } from '../../shared/data/fixtures';
import { ProfileCard } from '../../shared/ui/ProfileCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

export function CardStand() {
  return (
    <StandLayout title="Карточка">
      {(isLoading) => (
        <div
          className={styles.slot}
          data-skeleton={isLoading ? 'loading' : undefined}
          aria-busy={isLoading || undefined}
        >
          <ProfileCard profile={PROFILE} />
        </div>
      )}
    </StandLayout>
  );
}
