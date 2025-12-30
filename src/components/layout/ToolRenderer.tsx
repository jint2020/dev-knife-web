/**
 * ToolRenderer Component
 * 
 * Renders a tool component with proper lazy loading and error handling.
 * Used in Keep-Alive mode to preserve tool state when switching tabs.
 * 
 * @param toolId - The unique identifier of the tool to render
 * @param isActive - Whether this tool is currently visible
 */

import { Suspense, type ComponentType } from 'react';
import { toolRegistry } from '@/tools/registry';
import { cn } from '@/lib/utils';

interface ToolRendererProps {
  toolId: string;
  isActive: boolean;
}

export function ToolRenderer({ toolId, isActive }: ToolRendererProps) {
  // Get tool component from registry
  const tool = toolRegistry.getAll().find((t) => t.id === toolId);

  if (!tool) {
    return (
      <div className={cn(
        'flex items-center justify-center h-full w-full',
        isActive ? 'block' : 'hidden'
      )}>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-destructive">Tool Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The tool "{toolId}" is not registered in the system.
          </p>
        </div>
      </div>
    );
  }

  const ToolComponent = tool.component as ComponentType;

  return (
    <div
      className={cn(
        // Always maintain full dimensions
        'h-full w-full',
        // Use CSS to show/hide instead of conditional rendering
        // This preserves the component's DOM and React state
        isActive ? 'block' : 'hidden'
      )}
      data-tool-id={toolId}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">
                Loading {tool.title}...
              </p>
            </div>
          </div>
        }
      >
        <ToolComponent />
      </Suspense>
    </div>
  );
}
