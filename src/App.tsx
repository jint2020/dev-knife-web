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
import { TooltipProvider } from './components/ui/tooltip';
import { AppRouter } from './router';
import { registerTools } from './tools/registry';
import { useAppStore } from './store';
import './styles/globals.css';

// Register all tools on app initialization
registerTools();

function App() {
  const theme = useAppStore((state) => state.theme);

  // Apply theme to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <TooltipProvider>
      <AppRouter />
    </TooltipProvider>
  );
}

export default App;


