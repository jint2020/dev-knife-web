/**
 * DevKnife Web - Main Application
 * 
 * Multi-Tab Layout Architecture with Keep-Alive:
 * - Left: Sidebar with Logo (h-24) + Navigation
 * - Right: Header (h-14) + TabBar (h-10) + Content Area
 * 
 * Keep-Alive Strategy:
 * - ALL opened tabs are rendered simultaneously
 * - Only the active tab is visible (CSS: block vs hidden)
 * - This preserves component state (form inputs, scroll position, etc.)
 * - Trade-off: Memory usage increases with open tabs (acceptable for tool apps)
 * 
 * Height Alignment (Cross-alignment):
 * Sidebar Logo (h-24) = Header (h-14) + TabBar (h-10)
 * 96px = 56px + 40px ✓
 */

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TabBar } from './components/layout/TabBar';
import { ToolRenderer } from './components/layout/ToolRenderer';
import { registerTools } from './tools/registry';
import { useAppStore } from './hooks/useAppStore';
import './styles/globals.css';

// Register all tools on app initialization
registerTools();

function App() {
  const theme = useAppStore((state) => state.theme);
  const tabs = useAppStore((state) => state.tabs);
  const activeTabId = useAppStore((state) => state.activeTabId);
  const { t } = useTranslation();

  // Apply theme to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

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
                      <span className="text-muted-foreground">{t('sidebar.anyToolOnTheLeft')}</span>
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
                      display: tab.id === activeTabId ? 'block' : 'none'
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
    </BrowserRouter>
  );
}

export default App;


