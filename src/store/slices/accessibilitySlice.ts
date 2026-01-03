/**
 * Accessibility Slice
 *
 * Manages accessibility settings including color weak mode and other accessibility features.
 */

import type { AppSlice, AccessibilitySlice } from '../types';

export const createAccessibilitySlice: AppSlice<AccessibilitySlice> = (set) => ({
  colorWeakMode: false,
  setColorWeakMode: (enabled) =>
    set(() => ({
      colorWeakMode: enabled,
    })),
  toggleColorWeakMode: () =>
    set((state) => ({
      colorWeakMode: !state.colorWeakMode,
    })),
});
