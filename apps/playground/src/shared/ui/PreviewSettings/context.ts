import { createContext, useContext } from 'react';

export type Theme = 'system' | 'light' | 'dark';
export type Width = 'full' | '375' | '768';
export type TextLength = 'normal' | 'long';

export type PreviewSettings = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  width: Width;
  setWidth: (width: Width) => void;
  textLength: TextLength;
  setTextLength: (length: TextLength) => void;
};

export const PreviewSettingsContext = createContext<PreviewSettings | null>(null);

export function usePreviewSettings() {
  const context = useContext(PreviewSettingsContext);
  if (!context) throw new Error('PreviewSettingsProvider is required');
  return context;
}
