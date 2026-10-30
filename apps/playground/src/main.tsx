import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { PreviewSettingsProvider } from './shared/ui/PreviewSettings';
import 'loadshape/styles.css';
import './index.css';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  history: import.meta.env.BASE_URL === '/' ? undefined : createHashHistory(),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <PreviewSettingsProvider>
      <RouterProvider router={router} />
    </PreviewSettingsProvider>
  </StrictMode>,
);
