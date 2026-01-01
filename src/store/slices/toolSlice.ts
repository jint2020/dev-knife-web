import type { AppSlice, ToolSlice } from '../types';

export const createToolSlice: AppSlice<ToolSlice> = (set, get) => ({
  toolStates: {},
  setToolState: (toolId, state) =>
    set((prev) => ({
      toolStates: {
        ...prev.toolStates,
        [toolId]: { ...(prev.toolStates[toolId] || {}), ...state },
      },
    })),
  getToolState: (toolId, defaultValue) => get().toolStates[toolId] || defaultValue,
  clearToolState: (toolId) =>
    set((prev) => {
      const newStates = { ...prev.toolStates };
      delete newStates[toolId];
      return { toolStates: newStates };
    }),
});
