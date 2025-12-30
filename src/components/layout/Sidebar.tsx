/**
 * Sidebar Component
 * 
 * Navigation sidebar with tool categories
 * - Logo area: h-24 (96px) - CRITICAL for alignment
 * - Clicking tools opens them in tabs instead of routing
 */

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toolRegistry } from '@/tools/registry';
import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/hooks/useAppStore';

export function Sidebar() {
  const tools = toolRegistry.getAll();
  const categories = Array.from(new Set(tools.map((t) => t.category)));
  const activeTabId = useAppStore((state) => state.activeTabId);
  const openTool = useAppStore((state) => state.openTool);

  return (
    <div className="flex flex-col h-full border-r border-border bg-card">
      {/* Logo Area - HEIGHT: h-24 (96px) - CRITICAL for alignment */}
      <div className="h-24 flex items-center px-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">DevKnife</h1>
            <p className="text-xs text-muted-foreground">Developer Tools</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryTools = toolRegistry.getByCategory(category);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category}
                </h3>
                <nav className="space-y-1">
                  {categoryTools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = tool.id === activeTabId;

                    return (
                      <button
                        key={tool.id}
                        onClick={() =>
                          openTool({
                            id: tool.id,
                            title: tool.title,
                            icon: tool.icon,
                            path: tool.path,
                          })
                        }
                        className={cn(
                          'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{tool.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{tools.length} Tools</span>
          <Badge variant="secondary" className="text-[10px]">
            v1.0.0
          </Badge>
        </div>
      </div>
    </div>
  );
}
