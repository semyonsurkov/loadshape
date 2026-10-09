import { Skeleton } from 'loadshape';
import { PROFILE } from '../../shared/data/fixtures';
import { ProfileCard } from '../../shared/ui/ProfileCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

export function CardStand() {
  return (
    <StandLayout title="Карточка">
      {(isLoading) => (
        <Skeleton.Root loading={isLoading} className={styles.slot}>
          <ProfileCard profile={PROFILE} />
        </Skeleton.Root>
      )}
    </StandLayout>
  );
}
