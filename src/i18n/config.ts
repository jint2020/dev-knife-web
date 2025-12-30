/**
 * i18n Configuration
 * 
 * Configures i18next for multi-language support in DevKnife Web
 * 
 * Features:
 * - Offline-first: Translation resources are imported as TypeScript objects
 * - Language detection: Browser language + localStorage persistence
 * - Supported languages: English (en), Chinese (zh)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './locales/en';
import { zh } from './locales/zh';

// Language resources (TypeScript objects for offline-first approach)
const resources = {
  en,
  zh,
};

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
] as const;

export type LanguageCode = 'en' | 'zh';

// Initialize i18next
i18n
  // Use language detector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize with options
  .init({
    resources,
    fallbackLng: 'en', // Default language
    
    // Language detection configuration
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator'],
      // Keys to use for localStorage
      caches: ['localStorage'],
      // localStorage key name
      lookupLocalStorage: 'devknife-language',
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    // Debug mode (disable in production)
    debug: false,

    // React options
    react: {
      useSuspense: false, // Disable suspense to avoid flash of loading state
    },
  });

export default i18n;
