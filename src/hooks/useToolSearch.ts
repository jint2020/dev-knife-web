import { useMemo } from 'react';
import { useToolService } from '@/services/tool/ToolServiceContext';
import type { Tool } from '@/types/tool';

/**
 * Hook for searching tools with real-time filtering
 * Optimized for command palette and search UI
 *
 * @param query - Search query string
 * @returns Filtered tool list
 *
 * @example
 * const results = useToolSearch('uuid');
 * // Returns tools matching 'uuid'
 */
export function useToolSearch(query: string): Tool[] {
  const service = useToolService();

  return useMemo(
    () => {
      if (!query.trim()) {
        return service.getAllTools();
      }
      return service.searchTools(query);
    },
    [service, query]
  );
}
