# Multi-Tab Layout - Height Alignment Documentation

## Overview
DevKnife Web uses a **Multi-Tab Interface** similar to VSCode/Chrome, with strict pixel-perfect alignment between left and right panels.

## Cross-Alignment Structure (十字对齐)

```
┌─────────────────┬────────────────────────────────────┐
│                 │                                    │
│   Sidebar Logo  │          Header (Top)              │  
│                 │    (Search + Theme Toggle)         │
│     h-24        │           h-14                     │
│    (96px)       ├────────────────────────────────────┤
│                 │         Tab Bar                    │
│                 │    (Opened Tool Tabs)              │
│                 │           h-10                     │
├─────────────────┼────────────────────────────────────┤
│                 │                                    │
│   Navigation    │       Content Area                 │
│   (Scrollable)  │       (Active Tool)                │
│                 │                                    │
│   flex-1        │         flex-1                     │
│                 │                                    │
└─────────────────┴────────────────────────────────────┘
```

## Critical Height Classes

### Left Panel (Sidebar)
- **Logo Area**: `h-24` (96px) - Fixed height container
  - File: `src/components/layout/Sidebar.tsx`
  - Class: `.h-24.flex.items-center.px-6.flex-shrink-0`

### Right Panel (Main Content)
- **Header**: `h-14` (56px) - Top header with search and actions
  - File: `src/components/layout/Header.tsx`
  - Class: `.h-14.w-full.border-b.flex-shrink-0`

- **Tab Bar**: `h-10` (40px) - Horizontal tabs for opened tools
  - File: `src/components/layout/TabBar.tsx`
  - Class: `.h-10.border-b.bg-background`

### Verification
```
Left:  h-24 = 96px
Right: h-14 + h-10 = 56px + 40px = 96px ✓
```

## State Management

### Zustand Store (`useAppStore`)
Located in: `src/hooks/useAppStore.ts`

#### Tab Interface
```typescript
interface Tab {
  id: string;        // Tool ID
  title: string;     // Display name
  icon: LucideIcon;  // Icon component
  path: string;      // Route path (for reference)
}
```

#### State
- `tabs: Tab[]` - Array of opened tools
- `activeTabId: string | null` - Currently visible tool

#### Actions
- `openTool(tool)` - Add tab if doesn't exist, set as active
- `closeTool(toolId)` - Remove tab, smart switch to adjacent
- `closeAllTabs()` - Clear all tabs
- `setActiveTab(toolId)` - Switch active tab

## Component Behavior

### Sidebar Navigation
- **File**: `src/components/layout/Sidebar.tsx`
- **Behavior**: Clicking tools calls `openTool()` instead of routing
- **Active State**: Highlights when `tool.id === activeTabId`

### Tab Bar
- **File**: `src/components/layout/TabBar.tsx`
- **Features**:
  - Horizontal scroll when many tabs open (scrollbar hidden)
  - Active tab has higher contrast background
  - Top border indicator (`border-t-2 border-t-primary`) for active tab
  - Close button (X icon) for each tab
  - Empty state message when no tabs open

### Main Content Area
- **File**: `src/App.tsx`
- **Rendering**: Shows component of `activeTabId` tool
- **Fallback**: Welcome screen when no tabs open

### Command Palette
- **File**: `src/components/layout/CommandPalette.tsx`
- **Behavior**: Selecting tool calls `openTool()` and closes palette

## Styling Guidelines

### Active Tab Indicators
```tsx
// Active state
isActive
  ? 'bg-background text-foreground border-t-2 border-t-primary'
  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
```

### Horizontal Scroll (Tab Bar)
```tsx
<ScrollArea className="h-full">
  <div className="flex h-full items-center">
    {/* tabs */}
  </div>
  <ScrollBar orientation="horizontal" className="invisible" />
</ScrollArea>
```

## Testing Checklist

- [ ] Logo area and Header+TabBar are visually aligned at bottom edge
- [ ] Clicking sidebar tool opens it in tab
- [ ] Clicking tab switches to that tool
- [ ] Closing active tab switches to adjacent tab
- [ ] Tab bar scrolls horizontally when many tabs open
- [ ] Active tab has visual indicators (background + top border)
- [ ] Cmd+K search opens tool in tab
- [ ] Welcome screen shows when no tabs open

## Future Enhancements

- [ ] Drag-and-drop tab reordering
- [ ] Middle-click to close tabs
- [ ] Tab context menu (Close Others, Close All Right, etc.)
- [ ] Tab persistence across page reloads (optional)
- [ ] Mobile responsive tab bar (collapse to dropdown)
