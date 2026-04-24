import type { AppSlice, TabSlice } from '../types';

export const createTabSlice: AppSlice<TabSlice> = (set, get) => ({
  tabs: [],
  activeTabId: null,
  windowStates: {},
  zOrder: [],

  openTool: (tool) => {
    const { tabs, zOrder } = get();
    const existingTab = tabs.find((t) => t.id === tool.id);

    if (existingTab) {
      set({
        activeTabId: tool.id,
        windowStates: {
          ...get().windowStates,
          [tool.id]: { ...get().windowStates[tool.id], isMinimized: false },
        },
      });
    } else {
      const newZOrder = [...zOrder, tool.id];
      set({
        tabs: [...tabs, tool],
        activeTabId: tool.id,
        zOrder: newZOrder,
        windowStates: {
          ...get().windowStates,
          [tool.id]: { isMinimized: false, isMaximized: false },
        },
      });
    }
  },

  closeTool: (toolId: string) => {
    const { tabs, activeTabId, zOrder, windowStates } = get();
    const tabIndex = tabs.findIndex((t) => t.id === toolId);
    if (tabIndex === -1) return;

    const newTabs = tabs.filter((t) => t.id !== toolId);
    const newZOrder = zOrder.filter((id) => id !== toolId);
    const { [toolId]: _, ...newWindowStates } = windowStates;

    let newActiveTabId = activeTabId;
    if (activeTabId === toolId) {
      if (newTabs.length > 0) {
        const adjacentIndex = tabIndex < newTabs.length ? tabIndex : tabIndex - 1;
        newActiveTabId = newTabs[adjacentIndex].id;
      } else {
        newActiveTabId = null;
      }
    }

    set({
      tabs: newTabs,
      activeTabId: newActiveTabId,
      zOrder: newZOrder,
      windowStates: newWindowStates,
    });
  },

  closeAllTabs: () => {
    set({
      tabs: [],
      activeTabId: null,
      zOrder: [],
      windowStates: {},
    });
  },

  setActiveTab: (toolId: string) => {
    const { tabs } = get();
    const tab = tabs.find((t) => t.id === toolId);
    if (tab) {
      set({ activeTabId: toolId });
    }
  },

  minimizeTool: (toolId: string) => {
    const { windowStates } = get();
    set({
      windowStates: {
        ...windowStates,
        [toolId]: { isMinimized: true, isMaximized: false },
      },
    });
  },

  maximizeTool: (toolId: string) => {
    const { windowStates } = get();
    set({
      windowStates: {
        ...windowStates,
        [toolId]: { isMaximized: true, isMinimized: false },
      },
    });
  },

  restoreTool: (toolId: string) => {
    const { windowStates } = get();
    set({
      windowStates: {
        ...windowStates,
        [toolId]: { isMinimized: false, isMaximized: false },
      },
      activeTabId: toolId,
    });
  },

  focusTool: (toolId: string) => {
    const { zOrder } = get();
    const newZOrder = zOrder.filter((id) => id !== toolId);
    newZOrder.push(toolId);
    set({ zOrder: newZOrder, activeTabId: toolId });
  },
});
