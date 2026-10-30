import { Skeleton } from 'loadshape';
import { usePreviewData } from '../../shared/data/usePreviewData';
import { ProfileCard } from '../../shared/ui/ProfileCard';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

export function CardStand() {
  const { profile } = usePreviewData();
  return (
    <StandLayout allowTextLength title="Card">
      {(isLoading) => (
        <Skeleton.Root loading={isLoading} className={styles.slot}>
          <ProfileCard profile={profile} />
        </Skeleton.Root>
      )}
    </StandLayout>
  );
}
