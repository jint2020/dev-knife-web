/**
 * AppLayout Component
 *
 * Main application layout with top header, sidebar, and content area
 * Implements the multi-tab Keep-Alive architecture
 *
 * Layout Structure:
 * - Top: Header (full-width, contains Logo)
 * - Below: Sidebar (left) + Main Content (right)
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { ToolRenderer } from './ToolRenderer';
import { useAppStore } from '@/store';

export function AppLayout() {
  const { t } = useTranslation();
  const tabs = useAppStore((state) => state.tabs);
  const activeTabId = useAppStore((state) => state.activeTabId);
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const sidebarWidth = useAppStore((state) => state.sidebarWidth);
  const setSidebarWidth = useAppStore((state) => state.setSidebarWidth);

  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Handle mouse events for resizing
  useEffect(() => {
    if (!isResizing) return;

    // Add global styles during resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const containerRect = sidebarRef.current.parentElement?.getBoundingClientRect();
        if (containerRect) {
          const newWidth = e.clientX - containerRect.left;
          setSidebarWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Remove global styles
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Ensure styles are reset if component unmounts during resize
      if (isResizing) {
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };
  }, [isResizing, setSidebarWidth]);

  // Set initial sidebar width from store
  useEffect(() => {
    if (sidebarRef.current && !isSidebarCollapsed) {
      sidebarRef.current.style.width = `${sidebarWidth}px`;
    }
  }, [sidebarWidth, isSidebarCollapsed]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Header - Full Width - HEIGHT: h-14 (56px) */}
      <Header />

      {/* Below Header: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Left Panel (dynamic width based on collapse state) */}
        <aside
          ref={sidebarRef}
          className={`flex-shrink-0 hidden lg:block transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'w-16' : ''
          }`}
          style={{
            width: isSidebarCollapsed ? undefined : `${sidebarWidth}px`,
          } as React.CSSProperties}
        >
          <Sidebar />
        </aside>

        {/* Resize Handle */}
        {!isSidebarCollapsed && (
          <div
            ref={resizeHandleRef}
            className="hidden lg:block w-3 bg-transparent hover:bg-primary/30 cursor-col-resize transition-colors -ml-1.5 z-10 relative group"
            onMouseDown={() => setIsResizing(true)}
            style={{ height: 'calc(100vh - 3.5rem)' }} // Account for header height (h-14 = 3.5rem)
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-full rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-1 h-full bg-primary rounded-full flex flex-col justify-center">
                <div className="w-1 h-0.5 bg-primary mx-auto mb-0.5 rounded-full"></div>
                <div className="w-1 h-0.5 bg-primary mx-auto mb-0.5 rounded-full"></div>
                <div className="w-1 h-0.5 bg-primary mx-auto mb-0.5 rounded-full"></div>
                <div className="w-1 h-0.5 bg-primary mx-auto rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Right Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar - HEIGHT: h-10 (40px) */}
          <TabBar />

          {/* Content Area - Flexible height with Keep-Alive */}
          <main className="relative flex-1 overflow-hidden bg-background">
            {tabs.length === 0 ? (
              // Welcome Screen when no tabs are open
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 max-w-md px-4">
                  <div className="text-6xl">🔧</div>
                  <h2 className="text-3xl font-bold">{t('welcome.title')}</h2>
                  <p className="text-muted-foreground text-lg">
                    {t('welcome.description')}
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-sm">
                      <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded">
                        {t('sidebar.click')}
                      </kbd>
                      <span className="text-muted-foreground">
                        {t('sidebar.anyToolOnTheLeft')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Render ALL opened tabs (Keep-Alive mode)
              // Each tool maintains its own state even when hidden
              <>
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className="absolute inset-0 overflow-y-auto"
                    style={{
                      display: tab.id === activeTabId ? 'block' : 'none',
                    }}
                  >
                    <ToolRenderer
                      toolId={tab.id}
                      isActive={tab.id === activeTabId}
                    />
                  </div>
                ))}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
