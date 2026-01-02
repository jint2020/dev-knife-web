import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState } from './types';
import { createThemeSlice } from './slices/themeSlice';
import { createSidebarSlice } from './slices/sidebarSlice';
import { createTabSlice } from './slices/tabSlice';
import { createToolSlice } from './slices/toolSlice';

/**
 * Size-aware storage wrapper that handles QuotaExceededError
 *
 * Strategy:
 * 1. Try to save normally
 * 2. If QuotaExceededError occurs, clear toolStates and retry
 * 3. This preserves theme and UI preferences while allowing large tool data
 */
const createSizeAwareStorage = () => {
  const storage = localStorage;
  const STORAGE_KEY = 'devknife-storage';

  return {
    getItem: (name: string): string | null => {
      return storage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      try {
        storage.setItem(name, value);
      } catch (error) {
        // Handle QuotaExceededError
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('[Storage] Quota exceeded, clearing tool states to free space...');

          try {
            // Parse current state
            const currentState = storage.getItem(STORAGE_KEY);
            if (currentState) {
              const parsed = JSON.parse(currentState);

              // Keep only essential state (theme, UI preferences)
              // Note: tabs are intentionally excluded as they contain non-serializable components
              const essentialState = {
                state: {
                  theme: parsed.state?.theme,
                  isSidebarCollapsed: parsed.state?.isSidebarCollapsed,
                  expandedCategories: parsed.state?.expandedCategories,
                  sidebarWidth: parsed.state?.sidebarWidth,
                  toolStates: {}, // Clear all tool states to free space
                },
                version: parsed.version,
              };

              // Save the reduced state
              storage.setItem(STORAGE_KEY, JSON.stringify(essentialState));
              console.info('[Storage] Tool states cleared successfully');
            }
          } catch (cleanupError) {
            // If cleanup fails, clear everything and start fresh
            console.error('[Storage] Failed to cleanup, clearing all storage:', cleanupError);
            storage.removeItem(STORAGE_KEY);
          }
        } else {
          // Re-throw other errors
          console.error('[Storage] Unexpected storage error:', error);
        }
      }
    },
    removeItem: (name: string): void => {
      storage.removeItem(name);
    },
  };
};

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
      storage: createJSONStorage(() => createSizeAwareStorage()),
      partialize: (state) => ({
        theme: state.theme,
        isSidebarCollapsed: state.isSidebarCollapsed,
        expandedCategories: state.expandedCategories,
        sidebarWidth: state.sidebarWidth,
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
