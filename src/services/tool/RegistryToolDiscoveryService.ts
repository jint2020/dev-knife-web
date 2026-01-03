import { toolRegistry } from '@/tools/registry';
import type { IToolDiscoveryService } from './IToolDiscoveryService';
import type { Tool, ToolCategory, ToolMeta } from '@/types/tool';

/**
 * Registry-based implementation of tool discovery service
 * Adapts the existing ToolRegistry singleton to the service interface
 *
 * This class provides an adapter layer that:
 * - Wraps the existing toolRegistry singleton
 * - Implements the IToolDiscoveryService interface
 * - Enables testing through interface abstraction
 * - Allows future swapping of implementations
 */
export class RegistryToolDiscoveryService implements IToolDiscoveryService {
  getAllTools(): Tool[] {
    return toolRegistry.getAll();
  }

  getToolById(id: string): Tool | undefined {
    return toolRegistry.getById(id);
  }

  getToolsByCategory(category: ToolCategory): Tool[] {
    return toolRegistry.getByCategory(category);
  }

  getAllCategories(): ToolCategory[] {
    const tools = this.getAllTools();
    return Array.from(new Set(tools.map((t) => t.category))) as ToolCategory[];
  }

  searchTools(query: string): Tool[] {
    return toolRegistry.search(query);
  }

  getToolMeta(id: string): ToolMeta | undefined {
    const tool = this.getToolById(id);
    if (!tool) return undefined;

    // Extract metadata without component
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { component, ...meta } = tool;
    return meta;
  }

  hasTool(id: string): boolean {
    return this.getToolById(id) !== undefined;
  }
}
