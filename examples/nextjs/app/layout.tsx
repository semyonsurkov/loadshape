import type { ReactNode } from 'react';
import 'loadshape/styles.css';
import './styles/base.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
