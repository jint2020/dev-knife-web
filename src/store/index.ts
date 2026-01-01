import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState } from './types';
import { createThemeSlice } from './slices/themeSlice';
import { createSidebarSlice } from './slices/sidebarSlice';
import { createTabSlice } from './slices/tabSlice';
import { createToolSlice } from './slices/toolSlice';

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createThemeSlice(...a),
      ...createSidebarSlice(...a),
      ...createTabSlice(...a),
      ...createToolSlice(...a),
    }),
    {
      name: 'devknife-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        isSidebarCollapsed: state.isSidebarCollapsed,
        expandedCategories: state.expandedCategories,
        // Don't persist tabs - they contain non-serializable icon components
        // tabs: state.tabs,
        // activeTabId: state.activeTabId,
        toolStates: state.toolStates,
      }),
    }
  )
);

// Re-export types for convenience
export type { Tab } from './types';
