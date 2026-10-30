import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/stands/progress/')({
  component: InitialPage,
});

function InitialPage() {
  return (
    <>
      <h2>Initial page</h2>
      <p>Choose a transition. This page stays visible while the next page loads.</p>
    </>
  );
}
