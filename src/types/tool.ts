import type { LucideIcon } from 'lucide-react';
import { lazy } from 'react';
import type { ComponentType } from 'react';

/**
 * Tool Category
 * Used to organize tools in the sidebar navigation
 */
export type ToolCategory =
  | 'crypto'
  | 'converters'
  | 'formatters'
  | 'generators'
  | 'image'
  | 'text'
  | 'all';

/**
 * Tool Metadata
 * Defines the structure of each tool in the registry
 */
export interface ToolMeta {
  /** Unique identifier for the tool */
  id: string;
  /** Display title */
  title: string;
  /** Short description */
  description: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** URL path (e.g., '/tools/uuid-generator') */
  path: string;
  /** Category for filtering */
  category: ToolCategory;
  /** Keywords for search */
  keywords: string[];
}

/**
 * Tool Registration Entry
 * Combines metadata with lazy-loaded component
 */
export interface Tool extends ToolMeta {
  /** Lazy-loaded component */
  component: ComponentType;
}

/**
 * Tool Registry
 * Central registry of all available tools
 */
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  /**
   * Register a new tool
   */
  register(meta: ToolMeta, componentPath: string): void {
    const component = lazy(() => import(/* @vite-ignore */ componentPath));
    this.tools.set(meta.id, { ...meta, component });
  }

  /**
   * Get all registered tools
   */
  getAll(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tool by ID
   */
  getById(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  /**
   * Get tools by category
   */
  getByCategory(category: ToolCategory): Tool[] {
    if (category === 'all') return this.getAll();
    return this.getAll().filter(tool => tool.category === category);
  }

  /**
   * Search tools by keywords
   */
  search(query: string): Tool[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(tool => {
      return (
        tool.title.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
      );
    });
  }
}

// Export singleton instance
export const toolRegistry = new ToolRegistry();
