import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store';

/**
 * Simple debounce implementation
 */
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * Hook for automatic tool state persistence with debounce
 *
 * @param toolId - Unique identifier for the tool
 * @param initialState - Initial state if no persisted state exists
 * @param debounceMs - Debounce delay in milliseconds (default: 500ms)
 * @returns [state, setState] - Similar to useState API
 *
 * @example
 * const [input, setInput] = useToolPersistence('base64-encoder', { text: '', mode: 'encode' });
 */
export function useToolPersistence<T extends Record<string, any>>(
  toolId: string,
  initialState: T,
  debounceMs: number = 500
): [T, (updates: Partial<T> | ((prev: T) => Partial<T>)) => void] {
  const { getToolState, setToolState } = useAppStore();

  // Initialize state from store or use initial state
  const [state, setState] = useState<T>(() => {
    const persistedState = getToolState<T>(toolId, initialState);
    return persistedState;
  });

  // Create a debounced save function
  const debouncedSave = useRef(
    debounce((newState: T) => {
      setToolState(toolId, newState);
    }, debounceMs)
  ).current;

  // Save to store whenever state changes (debounced)
  useEffect(() => {
    debouncedSave(state);
  }, [state, debouncedSave]);

  // Wrapper for setState that accepts partial updates or updater function
  const updateState = useCallback((updates: Partial<T> | ((prev: T) => Partial<T>)) => {
    setState((prev) => {
      const newUpdates = typeof updates === 'function' ? updates(prev) : updates;
      return { ...prev, ...newUpdates } as T;
    });
  }, []);

  return [state, updateState];
}
