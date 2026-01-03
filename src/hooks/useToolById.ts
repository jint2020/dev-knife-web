import { useMemo } from 'react';
import { useToolService } from '@/services/tool/ToolServiceContext';
import type { Tool, ToolMeta } from '@/types/tool';

/**
 * Hook for retrieving a specific tool by ID
 * Returns both full tool and metadata separately
 *
 * @param toolId - Unique tool identifier
 * @returns Tool object or undefined if not found
 *
 * @example
 * const tool = useToolById('uuid-generator');
 * if (!tool) return <NotFound />;
 * return <ToolComponent tool={tool} />;
 */
export function useToolById(toolId: string): Tool | undefined {
  const service = useToolService();

  return useMemo(
    () => service.getToolById(toolId),
    [service, toolId]
  );
}

/**
 * Hook for retrieving tool metadata only (without component)
 * Useful for UI display without loading component
 *
 * @param toolId - Unique tool identifier
 * @returns Tool metadata or undefined if not found
 *
 * @example
 * const meta = useToolMeta('uuid-generator');
 * return <div>{meta?.title}</div>;
 */
export function useToolMeta(toolId: string): ToolMeta | undefined {
  const service = useToolService();

  return useMemo(
    () => service.getToolMeta(toolId),
    [service, toolId]
  );
}
