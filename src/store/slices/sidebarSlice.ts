import type { AppSlice, SidebarSlice } from '../types';

export const createSidebarSlice: AppSlice<SidebarSlice> = (set, get) => ({
  isSidebarCollapsed: false,
  expandedCategories: [],
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
});
