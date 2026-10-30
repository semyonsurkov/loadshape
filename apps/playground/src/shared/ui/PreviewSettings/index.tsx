import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { PreviewSettingsContext, type TextLength, type Theme, type Width } from './context';

export function PreviewSettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [width, setWidth] = useState<Width>('full');
  const [textLength, setTextLength] = useState<TextLength>('normal');

  useEffect(() => {
    if (theme === 'system') delete document.documentElement.dataset.previewTheme;
    else document.documentElement.dataset.previewTheme = theme;
    return () => {
      delete document.documentElement.dataset.previewTheme;
    };
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, width, setWidth, textLength, setTextLength }),
    [theme, width, textLength],
  );

  return (
    <PreviewSettingsContext.Provider value={value}>{children}</PreviewSettingsContext.Provider>
  );
}
