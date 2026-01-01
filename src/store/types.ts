import type { StateCreator } from 'zustand';
import type { LucideIcon } from 'lucide-react';

export interface ThemeSlice {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export interface SidebarSlice {
  isSidebarCollapsed: boolean;
  expandedCategories: string[];
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleCategory: (categoryId: string) => void;
  collapseAllCategories: () => void;
}

export interface Tab {
  id: string;
  title: string;
  locales: string;
  icon: LucideIcon;
  path: string;
}

export interface TabSlice {
  tabs: Tab[];
  activeTabId: string | null;
  openTool: (tool: Tab) => void;
  closeTool: (toolId: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (toolId: string) => void;
}

export interface ToolSlice {
  toolStates: Record<string, any>;
  setToolState: (toolId: string, state: any) => void;
  getToolState: <T>(toolId: string, defaultValue: T) => T;
  clearToolState: (toolId: string) => void;
}

export type AppState = ThemeSlice & SidebarSlice & TabSlice & ToolSlice;
export type AppSlice<T> = StateCreator<AppState, [['zustand/persist', unknown]], [], T>;
