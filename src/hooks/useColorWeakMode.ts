/**
 * useColorWeakMode Hook
 *
 * Custom hook to manage color weak mode state and apply CSS classes to the DOM.
 * Synchronizes with Zustand store and persists across sessions.
 */

import { useEffect } from 'react';
import { useAppStore } from '@/store';

const COLOR_WEAK_CLASS = 'color-weak';

export function useColorWeakMode(): void {
  const colorWeakMode = useAppStore((state) => state.colorWeakMode);

  useEffect(() => {
    const rootElement = document.documentElement;

    if (colorWeakMode) {
      rootElement.classList.add(COLOR_WEAK_CLASS);
    } else {
      rootElement.classList.remove(COLOR_WEAK_CLASS);
    }
  }, [colorWeakMode]);
}

/**
 * Hook to get color weak mode state and controls
 * Returns the current state and functions to control it
 */
export function useColorWeakModeControls() {
  const colorWeakMode = useAppStore((state) => state.colorWeakMode);
  const setColorWeakMode = useAppStore((state) => state.setColorWeakMode);
  const toggleColorWeakMode = useAppStore((state) => state.toggleColorWeakMode);

  return {
    colorWeakMode,
    setColorWeakMode,
    toggleColorWeakMode,
  };
}
