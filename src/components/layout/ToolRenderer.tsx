/**
 * ToolRenderer Component
 *
 * Renders a tool component with proper lazy loading and error handling.
 * Used in Keep-Alive mode to preserve tool state when switching tabs.
 *
 * Features:
 * - Lazy loading with Suspense
 * - Error boundary for crash isolation
 * - Keep-Alive state preservation
 * - Automatic error recovery on tab switch
 *
 * @param toolId - The unique identifier of the tool to render
 * @param isActive - Whether this tool is currently visible
 */

import { Suspense, type ComponentType } from 'react';
import { toolRegistry } from '@/tools/registry';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { ErrorState } from '@/components/ui/error-state';

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
      {/*
        ErrorBoundary with key={toolId} ensures:
        1. Each tool has isolated error state
        2. Switching tabs resets error boundaries
        3. A crashed tool doesn't affect other tools
      */}
      <ErrorBoundary
        key={toolId}
        fallbackRender={({ error, reset }) => (
          <ErrorState
            title={`${tool.title} crashed`}
            description={
              process.env.NODE_ENV === 'development'
                ? error.message
                : 'This tool encountered an error. Try refreshing or switching to another tool.'
            }
            onRetry={reset}
            variant="full"
          />
        )}
        onError={(error) => {
          // Log errors in development
          if (process.env.NODE_ENV === 'development') {
            console.error(`Tool "${tool.title}" (${toolId}) crashed:`, error);
          }
        }}
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
      </ErrorBoundary>
    </div>
  );
}
