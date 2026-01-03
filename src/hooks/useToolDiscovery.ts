import { useMemo } from 'react';
import { useToolService } from '@/services/tool/ToolServiceContext';
import type { Tool, ToolCategory } from '@/types/tool';

interface UseToolDiscoveryReturn {
  tools: Tool[];
  categories: ToolCategory[];
  getToolsByCategory: (category: ToolCategory) => Tool[];
  getToolById: (id: string) => Tool | undefined;
  getAllTools: () => Tool[];
  searchTools: (query: string) => Tool[];
}

/**
 * Hook for discovering and accessing tools
 * Provides memoized tool lists and category information
 *
 * @example
 * const { tools, categories, getToolsByCategory, getToolById } = useToolDiscovery();
 *
 * @returns
 * - tools: Array of all tools
 * - categories: Array of unique categories
 * - getToolsByCategory: Function to filter tools by category
 * - getToolById: Function to get tool by ID (stable reference for callbacks)
 * - getAllTools: Function to get all tools
 * - searchTools: Function to search tools by query
 */
export function useToolDiscovery(): UseToolDiscoveryReturn {
  const service = useToolService();

  // Memoize expensive operations
  const tools = useMemo(() => service.getAllTools(), [service]);
  const categories = useMemo(() => service.getAllCategories(), [service]);

  // Memoized category filter function
  const getToolsByCategory = useMemo(
    () => (category: ToolCategory) => service.getToolsByCategory(category),
    [service]
  );

  // Expose getToolById as stable reference for callbacks
  const getToolById = useMemo(
    () => (id: string) => service.getToolById(id),
    [service]
  );

  return {
    tools,
    categories,
    getToolsByCategory,
    getToolById,
    getAllTools: () => service.getAllTools(),
    searchTools: (query: string) => service.searchTools(query),
  };
}
