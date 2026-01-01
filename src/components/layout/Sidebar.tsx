/**
 * Sidebar Component
 *
 * Navigation sidebar with collapsible tool categories
 * - Logo area: h-24 (96px) - CRITICAL for alignment
 * - Collapsible menu groups with smooth animations
 * - Global collapse/expand toggle
 * - Clicking tools opens them in tabs instead of routing
 */

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toolRegistry } from "@/tools/registry";
import {
  Wrench,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useTranslation } from "react-i18next";
import type { Tool } from "@/types/tool";

/**
 * Collapsed mode submenu - shown as tooltip/popover when hovering category icon
 */
function CollapsedCategoryMenu({
  category,
  tools,
  activeTabId,
  onToolClick,
}: {
  category: string;
  tools: Tool[];
  activeTabId: string | null;
  onToolClick: (tool: Tool) => void;
}) {
  const { t } = useTranslation();
  const FirstIcon = tools[0]?.icon;

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {FirstIcon && <FirstIcon className="h-5 w-5" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="p-0 w-48" sideOffset={8}>
        <div className="py-2">
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t(`categories.${category}`)}
          </div>
          <div className="space-y-0.5 px-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = tool.id === activeTabId;

              return (
                <button
                  key={tool.id}
                  onClick={() => onToolClick(tool)}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {t(`tools.${tool.locales}.title`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Expanded mode collapsible category
 */
function ExpandedCategoryMenu({
  category,
  tools,
  activeTabId,
  isExpanded,
  onToggle,
  onToolClick,
}: {
  category: string;
  tools: Tool[];
  activeTabId: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  onToolClick: (tool: Tool) => void;
}) {
  const { t } = useTranslation();

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <span className="font-semibold uppercase tracking-wider text-xs">
            {t(`categories.${category}`)}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <nav className="space-y-1 pt-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = tool.id === activeTabId;

            return (
              <button
                key={tool.id}
                onClick={() => onToolClick(tool)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left truncate">
                  {t(`tools.${tool.locales}.title`)}
                </span>
              </button>
            );
          })}
        </nav>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Sidebar() {
  const { t } = useTranslation();
  const tools = toolRegistry.getAll();
  const categories = Array.from(new Set(tools.map((t) => t.category)));

  // Store state
  const activeTabId = useAppStore((state) => state.activeTabId);
  const openTool = useAppStore((state) => state.openTool);
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const expandedCategories = useAppStore((state) => state.expandedCategories);
  const toggleCategory = useAppStore((state) => state.toggleCategory);

  const handleToolClick = (tool: Tool) => {
    openTool({
      id: tool.id,
      title: tool.title,
      locales: tool.locales,
      icon: tool.icon,
      path: tool.path,
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r border-border bg-card transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}
    >
        {/* Logo Area - HEIGHT: h-24 (96px) - CRITICAL for alignment */}
        <div
          className={cn(
            "h-24 flex items-center flex-shrink-0 transition-all duration-300",
            isSidebarCollapsed ? "justify-center px-2" : "px-6"
          )}
        >
          {isSidebarCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground cursor-default">
                  <Wrench className="h-5 w-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <p className="font-bold">DevKnife</p>
                <p className="text-xs text-muted-foreground">Developer Tools</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold whitespace-nowrap">
                  DevKnife
                </h1>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  Developer Tools
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <div
            className={cn(
              "py-4 transition-all duration-300",
              isSidebarCollapsed ? "px-2" : "px-3"
            )}
          >
            {isSidebarCollapsed ? (
              // Collapsed mode: icon-only with tooltip submenus
              <div className="flex flex-col items-center space-y-2">
                {categories.map((category) => {
                  const categoryTools = toolRegistry.getByCategory(category);
                  if (categoryTools.length === 0) return null;

                  return (
                    <CollapsedCategoryMenu
                      key={category}
                      category={category}
                      tools={categoryTools}
                      activeTabId={activeTabId}
                      onToolClick={handleToolClick}
                    />
                  );
                })}
              </div>
            ) : (
              // Expanded mode: collapsible category groups
              <div className="space-y-2">
                {categories.map((category) => {
                  const categoryTools = toolRegistry.getByCategory(category);
                  if (categoryTools.length === 0) return null;

                  return (
                    <ExpandedCategoryMenu
                      key={category}
                      category={category}
                      tools={categoryTools}
                      activeTabId={activeTabId}
                      isExpanded={expandedCategories.includes(category)}
                      onToggle={() => toggleCategory(category)}
                      onToolClick={handleToolClick}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer with version */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-2 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{tools.length} Tools</span>
              <Badge variant="secondary" className="text-[10px]">
                v1.0.0
              </Badge>
            </div>
          </div>
        )}

        {/* Collapse Toggle Button - Fixed at bottom */}
        <div className="border-t border-border p-2 flex-shrink-0">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors w-full",
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isSidebarCollapsed && "justify-center px-0"
                )}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <>
                    <PanelLeftClose className="h-5 w-5" />
                    <span className="flex-1 text-left">
                      {t("sidebar.collapse")}
                    </span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            {isSidebarCollapsed && (
              <TooltipContent side="right" sideOffset={8}>
                {t("sidebar.expand")}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
    </div>
  );
}
