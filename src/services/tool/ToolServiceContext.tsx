import { createContext, useContext } from 'react';
import type { IToolDiscoveryService } from './IToolDiscoveryService';

/**
 * React context for tool discovery service
 * Enables dependency injection at app level
 *
 * Usage:
 * 1. Wrap app with ToolServiceProvider at root
 * 2. Use useToolService() hook in components
 * 3. Swap implementations for testing
 */
const ToolServiceContext = createContext<IToolDiscoveryService | null>(null);

/**
 * Hook to access tool discovery service
 * Throws error if used outside provider
 *
 * @example
 * const service = useToolService();
 * const tools = service.getAllTools();
 */
export function useToolService(): IToolDiscoveryService {
  const service = useContext(ToolServiceContext);
  if (!service) {
    throw new Error('useToolService must be used within ToolServiceProvider');
  }
  return service;
}

/**
 * Provider component for tool discovery service
 * Should be mounted at app root level
 *
 * @example
 * <ToolServiceProvider service={toolDiscoveryService}>
 *   <App />
 * </ToolServiceProvider>
 */
export function ToolServiceProvider({
  service,
  children,
}: {
  service: IToolDiscoveryService;
  children: React.ReactNode;
}) {
  return (
    <ToolServiceContext.Provider value={service}>
      {children}
    </ToolServiceContext.Provider>
  );
}
