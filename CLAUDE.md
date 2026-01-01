# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevKnife Web is an offline-first, modular developer toolbox built with React 18, TypeScript, and Vite. All tools run entirely in the browser with no data leaving the device. The application features a multi-tab interface with Keep-Alive state preservation and is PWA-ready for desktop/mobile installation.

## Development Commands

```bash
# Development
npm run dev          # Start Vite dev server at http://localhost:5173

# Build & Preview
npm run build        # TypeScript compilation + Vite production build
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint on entire codebase
```

## Architecture Overview

### Multi-Tab Layout with Keep-Alive

The application uses a unique multi-tab architecture ([App.tsx:1-111](src/App.tsx#L1-L111)):

- **Sidebar** (left): Logo + Navigation (fixed width: `w-64`)
- **Main Area** (right): Header (`h-14`) + TabBar (`h-10`) + Content Area (flexible)
- **Keep-Alive Strategy**: ALL opened tabs render simultaneously but only the active tab is visible (`display: block` vs `display: none`). This preserves component state (form inputs, scroll position, etc.) across tab switches
- **Trade-off**: Memory usage scales with open tabs, which is acceptable for developer tool applications

Height alignment: Sidebar Logo (h-24 = 96px) = Header (h-14 = 56px) + TabBar (h-10 = 40px)

### Tool Registry System

Tools are registered centrally in [src/tools/registry.ts](src/tools/registry.ts) using a singleton `ToolRegistry` class ([src/types/tool.ts:52-101](src/types/tool.ts#L52-L101)):

- **Lazy Loading**: Tool components are lazy-loaded using dynamic imports with `@vite-ignore` comment
- **Registry Methods**: `register()`, `getAll()`, `getById()`, `getByCategory()`, `search()`
- **Tool Discovery**: The registry powers sidebar navigation, search, and routing

### State Management

**Zustand** store at [src/hooks/useAppStore.ts](src/hooks/useAppStore.ts):
- **Theme**: `light`/`dark` with persistence (synced to `localStorage`)
- **Tabs**: Array of opened tools with `activeTabId` tracking
- **Tab Operations**: `openTool()`, `closeTool()`, `closeAllTabs()`, `setActiveTab()`
- **Persistence Strategy**: Only theme persists across sessions; tabs intentionally reset on page reload

### Theming with Tweakcn

The app uses CSS variables compatible with [Tweakcn](https://tweakcn.com/) for theme customization:
- **Location**: [src/styles/globals.css](src/styles/globals.css)
- **Structure**: `:root` for light mode, `.dark` for dark mode
- **Integration**: Paste Tweakcn exports directly into marked sections
- **Theme Application**: Tailwind references these via `hsl(var(--background))` pattern

## Adding a New Tool

Each tool follows a three-file structure in `src/tools/<tool-name>/`:

1. **meta.ts** - Tool metadata and registration info:
   ```typescript
   import type { ToolMeta } from '@/types/tool';
   import { IconName } from 'lucide-react';

   export const myToolMeta: ToolMeta = {
     id: 'my-tool',              // Unique identifier
     title: 'My Tool',           // Display name (fallback)
     locales: 'tools.myTool',    // i18n namespace for translations
     description: 'Brief desc',  // Shown in sidebar/search (fallback)
     icon: IconName,             // Lucide icon component
     path: '/tools/my-tool',     // URL path
     category: 'generators',     // For filtering (crypto|converters|formatters|generators|image|text)
     keywords: ['keyword1'],     // For search
   };
   ```

2. **logic.ts** - Pure business logic (no React):
   ```typescript
   // Pure functions for tool functionality
   export function processData(input: string): string {
     // Business logic here
   }
   ```

3. **page.tsx** - React UI component:
   ```typescript
   import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

   export default function MyToolPage() {
     return (
       <div className="container mx-auto p-6">
         <Card>
           <CardHeader>
             <CardTitle>My Tool</CardTitle>
           </CardHeader>
           <CardContent>
             {/* Tool UI */}
           </CardContent>
         </Card>
       </div>
     );
   }
   ```

4. **Register in [src/tools/registry.ts](src/tools/registry.ts)**:
   ```typescript
   import { myToolMeta } from './my-tool/meta';

   export function registerTools(): void {
     toolRegistry.register(myToolMeta, '/src/tools/my-tool/page.tsx');
     // ... other tools
   }
   ```

The tool automatically appears in sidebar and search without additional routing configuration.

## Important Patterns

### Path Aliasing
- Use `@/` prefix for imports: `import { Button } from '@/components/ui/button'`
- Configured in [vite.config.ts:55-57](vite.config.ts#L55-L57)

### UI Components
- Built with **Shadcn UI** (Radix UI primitives + Tailwind)
- Components located in `src/components/ui/`
- Use existing components for consistency

### Offline-First Requirement
- **NO external API calls** - all processing must be client-side
- Use Web Crypto API, FileReader, Canvas API, etc. for functionality
- PWA configured via [vite.config.ts:10-52](vite.config.ts#L10-L52)

### Tool Separation of Concerns
- **logic.ts**: Pure, testable business logic
- **page.tsx**: React components and UI state
- **meta.ts**: Static metadata only

### Styling
- Tailwind CSS for all styling
- Use theme variables (`bg-background`, `text-foreground`, etc.)
- Dark mode automatically handled via `.dark` class on `<html>`

### Component Rendering
The [ToolRenderer](src/components/layout/ToolRenderer.tsx) component handles:
- Lazy loading with `Suspense`
- Error boundaries for missing tools
- Keep-Alive visibility management
- Loading states

### Internationalization (i18n)

The app uses **i18next** with offline-first TypeScript translation resources:

- **Config**: [src/i18n/config.ts](src/i18n/config.ts) - Initializes i18next with language detection
- **Locales**: [src/i18n/locales/](src/i18n/locales/) - Translation files (`en.ts`, `zh.ts`)
- **Supported Languages**: English (`en`), Chinese (`zh`)
- **Storage**: Language preference persisted to `localStorage` under key `devknife-language`

When adding a new tool, add translations to both locale files under the `tools.<toolId>` namespace:
```typescript
// In src/i18n/locales/en.ts and zh.ts
tools: {
  myTool: {
    title: 'My Tool',
    description: 'What it does',
    // Tool-specific UI strings...
  }
}
```

Usage in components:
```typescript
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
// t('tools.myTool.title')
```
