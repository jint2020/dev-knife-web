/**
 * TabBar Component
 * 
 * Horizontal tab bar showing opened tools with smooth scrolling
 * - HEIGHT: h-10 (40px) - CRITICAL for alignment with Sidebar Logo area
 * - Horizontal scrolling with left/right arrow buttons
 * - Active state with visual indicators (top border + background)
 * - Close button for each tab
 */

import { useRef, useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from "react-i18next";

export function TabBar() {
  const { t } = useTranslation();
  const tabs = useAppStore((state) => state.tabs);
  const activeTabId = useAppStore((state) => state.activeTabId);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const closeTool = useAppStore((state) => state.closeTool);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check if scrolling is needed
  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
  };

  // Update scroll state on mount, tabs change, and scroll
  useEffect(() => {
    updateScrollState();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollState);
      window.addEventListener('resize', updateScrollState);
      return () => {
        container.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, [tabs]);

  // Scroll handlers
  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // Empty state
  if (tabs.length === 0) {
    return (
      <div className="h-10 border-b border-border bg-muted/30 flex items-center px-4">
        <span className="text-xs text-muted-foreground">
          No tools open - Click a tool from sidebar to get started
        </span>
      </div>
    );
  }

  return (
    // HEIGHT: h-10 (40px) - CRITICAL for alignment
    <div className="relative h-10 border-b border-border bg-background">
      {/* Left Scroll Button */}
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-0 z-10 h-full w-8 rounded-none border-r border-border bg-background/95 hover:bg-accent shadow-[2px_0_8px_rgba(0,0,0,0.1)]"
          onClick={handleScrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      )}

      {/* Scrollable Tab Container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex h-full overflow-x-auto overflow-y-hidden scrollbar-thin",
          showLeftArrow && "pl-8",
          showRightArrow && "pr-8"
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              className={cn(
                // Base styling - h-full, flex-shrink-0 prevents compression
                'group relative flex items-center gap-2 h-full px-4 cursor-pointer transition-all border-r border-border flex-shrink-0',
                // Active state - high contrast background + top border
                isActive
                  ? 'bg-background text-foreground border-t-2 border-t-primary'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {/* Tab Icon */}
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              
              {/* Tab Title */}
              <span className="text-sm font-medium whitespace-nowrap max-w-[160px] truncate">
                {/* {tab.title} */}
                {t(`tools.${tab.locales}.title`)}
              </span>

              {/* Close Button - Shows on hover */}
              <span
                className={cn(
                  'flex items-center justify-center h-5 w-5 ml-1 rounded-sm',
                  'opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity',
                  'hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTool(tab.id);
                }}
              >
                <X className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 z-10 h-full w-8 rounded-none border-l border-border bg-background/95 hover:bg-accent shadow-[-2px_0_8px_rgba(0,0,0,0.1)]"
          onClick={handleScrollRight}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      )}
    </div>
  );
}


