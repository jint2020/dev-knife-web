import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LucideIcon } from 'lucide-react';

/**
 * Tab interface - represents an opened tool
 */
export interface Tab {
  /** Tool ID */
  id: string;
  /** Tool display title */
  title: string;
  /** i18n path */
  locales: string;
  /** Tool icon */
  icon: LucideIcon;
  /** Tool path for routing */
  path: string;
}

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Sidebar
  /** Whether the sidebar is collapsed (icon-only mode) */
  isSidebarCollapsed: boolean;
  /** Toggle sidebar collapsed state */
  toggleSidebar: () => void;
  /** Set sidebar collapsed state */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** Currently expanded menu category IDs */
  expandedCategories: string[];
  /** Toggle a category's expanded state */
  toggleCategory: (categoryId: string) => void;
  /** Collapse all categories (used when sidebar collapses) */
  collapseAllCategories: () => void;

  // Tabs Management
  /** Array of opened tool tabs */
  tabs: Tab[];
  /** Currently active tab ID */
  activeTabId: string | null;

  /** Open a tool - add to tabs if not exists, set as active */
  openTool: (tool: Tab) => void;
  /** Close a tool tab - smart switch to adjacent tab if closing active */
  closeTool: (toolId: string) => void;
  /** Close all tabs */
  closeAllTabs: () => void;
  /** Set active tab */
  setActiveTab: (toolId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setTheme: (theme) => set({ theme }),

      // Sidebar
      isSidebarCollapsed: false,
      toggleSidebar: () => {
        const { isSidebarCollapsed } = get();
        if (!isSidebarCollapsed) {
          // When collapsing, also collapse all categories
          set({ isSidebarCollapsed: true, expandedCategories: [] });
        } else {
          set({ isSidebarCollapsed: false });
        }
      },
      setSidebarCollapsed: (collapsed) => {
        if (collapsed) {
          set({ isSidebarCollapsed: true, expandedCategories: [] });
        } else {
          set({ isSidebarCollapsed: false });
        }
      },
      expandedCategories: [],
      toggleCategory: (categoryId: string) => {
        const { expandedCategories, isSidebarCollapsed } = get();
        // Don't allow expanding when sidebar is collapsed
        if (isSidebarCollapsed) return;

        if (expandedCategories.includes(categoryId)) {
          set({ expandedCategories: expandedCategories.filter((id) => id !== categoryId) });
        } else {
          set({ expandedCategories: [...expandedCategories, categoryId] });
        }
      },
      collapseAllCategories: () => set({ expandedCategories: [] }),

      // Tabs
      tabs: [],
      activeTabId: null,

      /**
       * Open Tool - Add tab if doesn't exist, set as active
       */
      openTool: (tool: Tab) => {
        const { tabs } = get();
        const existingTab = tabs.find((t) => t.id === tool.id);

        if (existingTab) {
          // Tool already open, just activate it
          set({ activeTabId: tool.id });
        } else {
          // Add new tab and activate it
          set({
            tabs: [...tabs, tool],
            activeTabId: tool.id,
          });
        }
      },

      /**
       * Close Tool - Remove tab and smart switch to adjacent
       */
      closeTool: (toolId: string) => {
        const { tabs, activeTabId } = get();
        const tabIndex = tabs.findIndex((t) => t.id === toolId);

        if (tabIndex === -1) return; // Tab not found

        const newTabs = tabs.filter((t) => t.id !== toolId);

        // If closing the active tab, switch to adjacent
        let newActiveTabId = activeTabId;
        if (activeTabId === toolId) {
          if (newTabs.length > 0) {
            // Prefer next tab, fallback to previous
            const adjacentIndex = tabIndex < newTabs.length ? tabIndex : tabIndex - 1;
            newActiveTabId = newTabs[adjacentIndex].id;
          } else {
            newActiveTabId = null; // No tabs left
          }
        }

        set({
          tabs: newTabs,
          activeTabId: newActiveTabId,
        });
      },

      /**
       * Close All Tabs
       */
      closeAllTabs: () => {
        set({
          tabs: [],
          activeTabId: null,
        });
      },

      /**
       * Set Active Tab
       */
      setActiveTab: (toolId: string) => {
        const { tabs } = get();
        const tab = tabs.find((t) => t.id === toolId);
        if (tab) {
          set({ activeTabId: toolId });
        }
      },
    }),
    {
      name: 'devknife-storage',
      // Only persist theme, not tabs (tabs should reset on page reload)
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

