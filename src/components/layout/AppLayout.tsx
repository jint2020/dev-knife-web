/**
 * AppLayout Component
 *
 * Main application layout with sidebar, header, and content area
 * Implements the multi-tab Keep-Alive architecture
 */

import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { ToolRenderer } from './ToolRenderer';
import { useAppStore } from '@/hooks/useAppStore';

export function AppLayout() {
  const { t } = useTranslation();
  const tabs = useAppStore((state) => state.tabs);
  const activeTabId = useAppStore((state) => state.activeTabId);
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Left Panel (dynamic width based on collapse state) */}
      <aside
        className={`flex-shrink-0 hidden lg:block transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
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
  );
}
