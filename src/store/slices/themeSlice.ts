import type { AppSlice, ThemeSlice } from '../types';

export const createThemeSlice: AppSlice<ThemeSlice> = (set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  setTheme: (theme) => set({ theme }),
});
