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
 * Estimates the size of a JSON-serializable object in bytes
 */
function estimateSize(obj: any): number {
  try {
    return new Blob([JSON.stringify(obj)]).size;
  } catch {
    return 0;
  }
}

export interface UseToolPersistenceOptions {
  /**
   * Debounce delay in milliseconds (default: 500ms)
   */
  debounceMs?: number;
  /**
   * Maximum size in bytes before skipping persistence (default: 1MB)
   * Set to 0 to disable size checking
   */
  maxSize?: number;
  /**
   * Fields to exclude from persistence (useful for large binary data)
   */
  excludeFields?: string[];
}

/**
 * Hook for automatic tool state persistence with debounce and size limits
 *
 * @param toolId - Unique identifier for the tool
 * @param initialState - Initial state if no persisted state exists
 * @param options - Configuration options
 * @returns [state, setState] - Similar to useState API
 *
 * @example
 * // Basic usage
 * const [state, setState] = useToolPersistence('base64-encoder', { text: '', mode: 'encode' });
 *
 * @example
 * // With size limit (skip persistence if state > 500KB)
 * const [state, setState] = useToolPersistence('image-tool', initialState, { maxSize: 500 * 1024 });
 *
 * @example
 * // Exclude large fields from persistence
 * const [state, setState] = useToolPersistence('base64-encoder', initialState, {
 *   excludeFields: ['output'] // Don't persist large output
 * });
 */
export function useToolPersistence<T extends Record<string, any>>(
  toolId: string,
  initialState: T,
  options: UseToolPersistenceOptions = {}
): [T, (updates: Partial<T> | ((prev: T) => Partial<T>)) => void] {
  const {
    debounceMs = 500,
    maxSize = 1024 * 1024, // 1MB default limit
    excludeFields = [],
  } = options;

  const { getToolState, setToolState } = useAppStore();

  // Initialize state from store or use initial state
  const [state, setState] = useState<T>(() => {
    const persistedState = getToolState<T>(toolId, initialState);
    return persistedState;
  });

  // Create a debounced save function with size checking
  const debouncedSave = useRef(
    debounce((newState: T) => {
      // Filter out excluded fields before persistence
      let stateToSave: any = newState;
      if (excludeFields.length > 0) {
        stateToSave = Object.keys(newState).reduce((acc: any, key) => {
          if (!excludeFields.includes(key)) {
            acc[key] = newState[key];
          }
          return acc;
        }, {});
      }

      // Check size if maxSize is set
      if (maxSize > 0) {
        const size = estimateSize(stateToSave);
        if (size > maxSize) {
          console.warn(
            `[useToolPersistence] State for "${toolId}" is too large (${(size / 1024).toFixed(1)}KB), skipping persistence`
          );
          return;
        }
      }

      setToolState(toolId, stateToSave);
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
