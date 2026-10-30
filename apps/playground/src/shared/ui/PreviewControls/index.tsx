import { usePreviewSettings } from '../PreviewSettings/context';
import styles from './styles.module.css';

export function PreviewControls({ allowTextLength }: { allowTextLength: boolean }) {
  const { theme, setTheme, width, setWidth, textLength, setTextLength } = usePreviewSettings();

  return (
    <div className={styles.controls} aria-label="Preview settings">
      <label className={styles.field}>
        <span>Theme</span>
        <select value={theme} onChange={(event) => setTheme(event.target.value as typeof theme)}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label className={styles.field}>
        <span>Preview width</span>
        <select value={width} onChange={(event) => setWidth(event.target.value as typeof width)}>
          <option value="full">Full width</option>
          <option value="375">375 px</option>
          <option value="768">768 px</option>
        </select>
      </label>
      {allowTextLength && (
        <label className={styles.field}>
          <span>Text length</span>
          <select
            value={textLength}
            onChange={(event) => setTextLength(event.target.value as typeof textLength)}
          >
            <option value="normal">Normal</option>
            <option value="long">Long</option>
          </select>
        </label>
      )}
    </div>
  );
}
