import type { AppSlice, TabSlice } from '../types';

export const createTabSlice: AppSlice<TabSlice> = (set, get) => ({
  tabs: [],
  activeTabId: null,

  /**
   * Open Tool - Add tab if doesn't exist, set as active
   */
  openTool: (tool) => {
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
});
