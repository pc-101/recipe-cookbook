import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const STORAGE_KEY = 'recipe-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove(theme === 'dark' ? 'light' : 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* noop */
    }
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#020617' : '#f8fafc');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = getInitialTheme();
    applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const next: Theme = event.matches ? 'dark' : 'light';
        setTheme(next);
        applyTheme(next);
      }
    };
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
