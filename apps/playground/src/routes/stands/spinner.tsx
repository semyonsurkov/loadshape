import { createFileRoute } from '@tanstack/react-router';
import { SpinnerStand } from '../../pages/SpinnerStand';

export const Route = createFileRoute('/stands/spinner')({
  component: SpinnerStand,
});
