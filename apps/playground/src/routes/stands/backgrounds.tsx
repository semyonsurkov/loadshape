import { createFileRoute } from '@tanstack/react-router';
import { BackgroundsStand } from '../../pages/BackgroundsStand';

export const Route = createFileRoute('/stands/backgrounds')({
  component: BackgroundsStand,
});
