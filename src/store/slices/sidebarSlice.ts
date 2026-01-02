import type { AppSlice, SidebarSlice } from '../types';

export const createSidebarSlice: AppSlice<SidebarSlice> = (set, get) => ({
  isSidebarCollapsed: false,
  expandedCategories: [],
  sidebarWidth: 256, // Default width in pixels (w-64 = 16rem = 256px)
  minSidebarWidth: 192, // Minimum width (w-48 = 12rem = 192px)
  maxSidebarWidth: 512, // Maximum width (w-128 = 32rem = 512px)
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
  setSidebarWidth: (width) => {
    const { minSidebarWidth, maxSidebarWidth } = get();
    const clampedWidth = Math.max(minSidebarWidth, Math.min(maxSidebarWidth, width));
    set({ sidebarWidth: clampedWidth });
  },
  resetSidebarWidth: () => {
    set({ sidebarWidth: 256 });
  },
});
