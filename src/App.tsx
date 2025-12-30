/**
 * DevKnife Web - Main Application
 * 
 * Multi-Tab Layout Architecture:
 * - Left: Sidebar with Logo (h-24) + Navigation
 * - Right: Header (h-14) + TabBar (h-10) + Content Area
 * 
 * Height Alignment (Cross-alignment):
 * Sidebar Logo (h-24) = Header (h-14) + TabBar (h-10)
 * 96px = 56px + 40px ✓
 */

import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TabBar } from './components/layout/TabBar';
import { registerTools, toolRegistry } from './tools/registry';
import { useAppStore } from './hooks/useAppStore';
import './styles/globals.css';

// Register all tools on app initialization
registerTools();

function App() {
  const theme = useAppStore((state) => state.theme);
  const tabs = useAppStore((state) => state.tabs);
  const activeTabId = useAppStore((state) => state.activeTabId);

  // Apply theme to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Get active tool component
  const activeTool = tabs.find((tab) => tab.id === activeTabId);
  const ActiveComponent = activeTool
    ? toolRegistry.getAll().find((tool) => tool.id === activeTool.id)?.component
    : null;

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Left Panel */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <Sidebar />
        </aside>

        {/* Main Content - Right Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header - HEIGHT: h-14 (56px) */}
          <Header />

          {/* Tab Bar - HEIGHT: h-10 (40px) */}
          <TabBar />

          {/* Content Area - Flexible height */}
          <main className="flex-1 overflow-y-auto bg-background">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-2">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                </div>
              }
            >
              {ActiveComponent ? (
                <ActiveComponent />
              ) : (
                // Welcome Screen when no tabs are open
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4 max-w-md px-4">
                    <div className="text-6xl">🔧</div>
                    <h2 className="text-3xl font-bold">Welcome to DevKnife</h2>
                    <p className="text-muted-foreground text-lg">
                      Your all-in-one developer toolbox. Select a tool from the sidebar to get started.
                    </p>
                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-sm">
                        <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded">
                          Click
                        </kbd>
                        <span className="text-muted-foreground">any tool on the left</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Suspense>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;


