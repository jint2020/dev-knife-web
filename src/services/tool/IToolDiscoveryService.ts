import type { Tool, ToolCategory, ToolMeta } from '@/types/tool';

/**
 * Interface for tool discovery service
 * Defines the contract for any tool data source implementation
 *
 * This interface enables:
 * - Dependency injection for testing
 * - Swapping implementations (registry, API, plugins)
 * - Clear separation between layout and business logic
 */
export interface IToolDiscoveryService {
  /**
   * Get all registered tools
   */
  getAllTools(): Tool[];

  /**
   * Get tool by unique ID
   */
  getToolById(id: string): Tool | undefined;

  /**
   * Get tools filtered by category
   */
  getToolsByCategory(category: ToolCategory): Tool[];

  /**
   * Get all unique categories
   */
  getAllCategories(): ToolCategory[];

  /**
   * Search tools by query string
   */
  searchTools(query: string): Tool[];

  /**
   * Get tool metadata (lightweight, without component)
   */
  getToolMeta(id: string): ToolMeta | undefined;

  /**
   * Check if tool exists
   */
  hasTool(id: string): boolean;
}
