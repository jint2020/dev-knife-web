/**
 * English Translation Resources
 * 
 * This file contains all English translations for DevKnife Web
 */

export const en = {
  translation: {
    // App Metadata
    app: {
      title: 'DevKnife',
      subtitle: 'Developer Tools',
      description: 'Your all-in-one developer toolbox',
      welcome: 'Welcome to DevKnife',
    },

    // Navigation & Layout
    nav: {
      search: 'Search tools...',
      searchPlaceholder: 'Type a command or search...',
      noResults: 'No results found.',
      favorites: 'Favorites',
      recent: 'Recent',
      tools: 'Tools',
    },

    // Common UI Elements
    common: {
      settings: 'Settings',
      theme: 'Theme',
      language: 'Language',
      close: 'Close',
      copy: 'Copy',
      copied: 'Copied',
      download: 'Download',
      upload: 'Upload',
      clear: 'Clear',
      reset: 'Reset',
      generate: 'Generate',
      format: 'Format',
      compress: 'Compress',
      convert: 'Convert',
      refresh: 'Refresh',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      clickToUpload: 'Click to upload or drag and drop',
      viewOnGithub: 'View on GitHub',
    },

    // Theme
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      toggleTheme: 'Toggle theme',
    },

    // Language
    language: {
      english: 'English',
      chinese: '中文',
      switchLanguage: 'Switch language',
    },

    // Sidebar
    sidebar: {
      noToolsOpen: 'No tools open - Click a tool from sidebar to get started',
      click: 'Click',
      anyToolOnTheLeft: 'any tool on the left',
    },

    // Tool Categories
    categories: {
      generators: 'Generators',
      crypto: 'Crypto & Encoders',
      formatters: 'Formatters',
      converters: 'Converters',
      text: 'Text Tools',
      image: 'Image Tools',
      all: 'All Tools',
    },

    // Welcome Screen
    welcome: {
      title: 'Welcome to DevKnife',
      description: 'Your all-in-one developer toolbox. Select a tool from the sidebar to get started.',
    },

    // Error Messages
    errors: {
      fileReadError: 'Failed to read file',
      invalidFile: 'Invalid file',
      processingError: 'Processing failed',
      networkError: 'Network error',
    },
  },
};

export type TranslationStructure = typeof en;
