import { useTheme } from '@/components/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      className="btn"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
