# Error Handling & File Upload Guide

This guide explains how to use the standardized error handling system and file upload component in DevKnife Web.

## Table of Contents

- [Error Handling System](#error-handling-system)
  - [ErrorState Component](#errorstate-component)
  - [ErrorBoundary Component](#errorboundary-component)
  - [ToolRenderer Integration](#toolrenderer-integration)
- [File Upload Component](#file-upload-component)
  - [FileDropZone Component](#filedropzone-component)
  - [Usage Examples](#usage-examples)

---

## Error Handling System

### ErrorState Component

**Location:** `src/components/ui/error-state.tsx`

Pure presentation component for rendering error states with consistent styling.

#### Props

```typescript
interface ErrorStateProps {
  title?: string;              // Error title (default: "Something went wrong")
  description?: string;        // Error message (default: generic message)
  icon?: LucideIcon;          // Custom icon (default: AlertCircle)
  onRetry?: () => void;       // Retry callback - shows retry button if provided
  variant?: 'compact' | 'full'; // Display mode (default: 'compact')
  className?: string;         // Additional CSS classes
}
```

#### Example Usage

```tsx
import { ErrorState } from '@/components/ui/error-state';
import { FileWarning } from 'lucide-react';

// Compact error (for cards/inline errors)
<ErrorState
  variant="compact"
  title="Upload Failed"
  description="File size exceeds 10MB limit"
  onRetry={() => console.log('Retry clicked')}
/>

// Full-page error
<ErrorState
  variant="full"
  icon={FileWarning}
  title="Tool Unavailable"
  description="This tool is temporarily unavailable. Please try again later."
/>
```

---

### ErrorBoundary Component

**Location:** `src/components/common/error-boundary.tsx`

React Error Boundary (Class Component) for catching JavaScript errors in component tree.

#### Props

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;                               // Static fallback UI
  fallbackRender?: (props: {                         // Dynamic fallback renderer
    error: Error;
    reset: () => void;
  }) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;  // Error callback
  onReset?: () => void;                              // Reset callback
}
```

#### Example Usage

**Basic Usage (Default Fallback)**

```tsx
import { ErrorBoundary } from '@/components/common/error-boundary';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**Custom Fallback Renderer**

```tsx
<ErrorBoundary
  fallbackRender={({ error, reset }) => (
    <ErrorState
      title="Component Error"
      description={error.message}
      onRetry={reset}
      variant="full"
    />
  )}
  onError={(error) => {
    console.error('Caught error:', error);
    // Send to error tracking service
  }}
  onReset={() => {
    // Clear any state before reset
  }}
>
  <MyComponent />
</ErrorBoundary>
```

**Static Fallback**

```tsx
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <MyComponent />
</ErrorBoundary>
```

---

### ToolRenderer Integration

**Location:** `src/components/layout/ToolRenderer.tsx`

The ToolRenderer automatically wraps each tool with an ErrorBoundary using `key={toolId}` to ensure:

1. **Crash Isolation** - One tool's error doesn't affect other tools
2. **Auto Recovery** - Switching tabs resets the error boundary
3. **Graceful Degradation** - Shows user-friendly error message with retry option

#### How It Works

```tsx
<ErrorBoundary
  key={toolId}  // ← Reset boundary when switching tools
  fallbackRender={({ error, reset }) => (
    <ErrorState
      title={`${tool.title} crashed`}
      description={
        process.env.NODE_ENV === 'development'
          ? error.message  // Show details in dev mode
          : 'Generic user-friendly message'
      }
      onRetry={reset}
      variant="full"
    />
  )}
>
  <Suspense fallback={<LoadingSpinner />}>
    <ToolComponent />
  </Suspense>
</ErrorBoundary>
```

#### What You Don't Need to Do

- ✅ Every tool is automatically wrapped - no setup required
- ✅ Error boundaries reset on tab switch
- ✅ Crash logs automatically appear in dev console

---

## File Upload Component

### FileDropZone Component

**Location:** `src/components/common/file-drop-zone.tsx`

Universal file upload component with drag-and-drop, validation, and error handling.

#### Props

```typescript
interface FileDropZoneProps {
  onFileSelect: (file: File) => void;  // Required: callback when valid file selected
  accept?: string;                      // MIME types (default: '*/*')
  maxSize?: number;                     // Max size in bytes
  title?: string;                       // Custom title
  description?: string;                 // Custom description
  className?: string;                   // Additional CSS classes
}
```

#### Features

- **Drag-and-Drop Support** - Visual feedback during drag
- **File Validation** - Size and MIME type checking
- **Smart MIME Matching** - Supports wildcards (`image/*`, `video/*`)
- **Error Display** - Uses ErrorState component for validation failures
- **Size Formatting** - Automatic human-readable file sizes

#### Example Usage

**Basic Image Upload**

```tsx
import { FileDropZone } from '@/components/common/file-drop-zone';

<FileDropZone
  onFileSelect={(file) => {
    console.log('Selected:', file.name);
    // Process file...
  }}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  title="Upload Image"
  description="PNG, JPG, or WebP up to 5MB"
/>
```

**Specific File Types**

```tsx
// Multiple specific types
<FileDropZone
  onFileSelect={handleFile}
  accept="image/png,image/jpeg,image/webp"
  maxSize={10 * 1024 * 1024}
/>

// Any file type
<FileDropZone
  onFileSelect={handleFile}
  accept="*/*"  // No restrictions
/>

// Documents only
<FileDropZone
  onFileSelect={handleFile}
  accept="application/pdf,application/msword"
  maxSize={20 * 1024 * 1024}
/>
```

**With Custom Styling**

```tsx
<FileDropZone
  onFileSelect={handleFile}
  accept="video/*"
  maxSize={50 * 1024 * 1024}
  className="min-h-[200px]"
  title="Drop Video Here"
  description="MP4, WebM, or AVI up to 50MB"
/>
```

---

## Usage Examples

### Example 1: Image Compression Tool

```tsx
import { useState } from 'react';
import { FileDropZone } from '@/components/common/file-drop-zone';
import { Card, CardContent } from '@/components/ui/card';

export default function ImageCompressor() {
  const [image, setImage] = useState<File | null>(null);

  const handleImageSelect = (file: File) => {
    setImage(file);
    // Start compression...
  };

  return (
    <Card>
      <CardContent className="p-6">
        <FileDropZone
          onFileSelect={handleImageSelect}
          accept="image/png,image/jpeg,image/webp"
          maxSize={10 * 1024 * 1024}
          title="Upload Image to Compress"
          description="PNG, JPEG, or WebP up to 10MB"
        />

        {image && (
          <div className="mt-4">
            Processing: {image.name}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Example 2: Error Handling in Tool

```tsx
import { ErrorBoundary } from '@/components/common/error-boundary';
import { ErrorState } from '@/components/ui/error-state';

export default function MyTool() {
  return (
    <ErrorBoundary
      fallbackRender={({ error, reset }) => (
        <ErrorState
          title="Tool Error"
          description={error.message}
          onRetry={reset}
        />
      )}
    >
      <div>
        {/* Tool content that might throw errors */}
      </div>
    </ErrorBoundary>
  );
}
```

### Example 3: Inline Error State

```tsx
import { useState } from 'react';
import { ErrorState } from '@/components/ui/error-state';
import { Card } from '@/components/ui/card';

export default function DataProcessor() {
  const [error, setError] = useState<string | null>(null);

  const processData = () => {
    try {
      // Process data...
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <Card>
        <ErrorState
          variant="compact"
          title="Processing Failed"
          description={error}
          onRetry={() => {
            setError(null);
            processData();
          }}
        />
      </Card>
    );
  }

  return <div>{/* Normal UI */}</div>;
}
```

---

## Best Practices

### Error Handling

1. **Use ErrorBoundary for component-level errors**
   - Wrap components that might crash
   - Provide meaningful fallback UI

2. **Use ErrorState for expected errors**
   - Form validation errors
   - API request failures
   - File upload validation

3. **Always provide retry actions**
   - Helps users recover from errors
   - Improves user experience

4. **Show detailed errors in development**
   - Use `process.env.NODE_ENV === 'development'` checks
   - Hide technical details in production

### File Uploads

1. **Always set reasonable size limits**
   - Prevents browser crashes
   - Improves performance

2. **Be specific with MIME types**
   - Better validation
   - Clearer user expectations

3. **Provide clear feedback**
   - Custom titles and descriptions
   - Show file constraints

4. **Handle errors gracefully**
   - FileDropZone automatically shows validation errors
   - Add custom error handling for processing failures

---

## Architecture Benefits

### Separation of Concerns

- **Presentation** (ErrorState) - Pure UI, no logic
- **Logic** (ErrorBoundary) - Error catching, state management
- **Integration** (ToolRenderer) - Combines both for tool isolation

### Reusability

- One ErrorState component serves all error scenarios
- One FileDropZone component serves all upload needs
- No code duplication across tools

### Maintainability

- Centralized error handling logic
- Consistent UX across all tools
- Easy to update styling/behavior globally

---

## Migration Guide

### Converting Existing File Uploads

**Before:**

```tsx
<input
  type="file"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }}
/>
```

**After:**

```tsx
<FileDropZone
  onFileSelect={handleFile}
  accept="*/*"
/>
```

### Converting Existing Error Displays

**Before:**

```tsx
{error && (
  <div className="text-red-500">
    Error: {error}
  </div>
)}
```

**After:**

```tsx
{error && (
  <ErrorState
    variant="compact"
    title="Error"
    description={error}
    onRetry={() => setError(null)}
  />
)}
```

---

## Troubleshooting

### FileDropZone not accepting files

- Check `accept` prop matches your file's MIME type
- Verify file size doesn't exceed `maxSize`
- Check browser console for validation errors

### ErrorBoundary not catching errors

- ErrorBoundary only catches errors in child components
- Errors in event handlers need try-catch
- Errors in async code need Promise.catch()

### Styling conflicts

- Use `className` prop to override default styles
- Check Tailwind class ordering
- Use `!important` as last resort

---

## Future Enhancements

Potential improvements for future versions:

1. **Multiple file support** in FileDropZone
2. **Progress indicators** for large uploads
3. **Error reporting service** integration
4. **Internationalization** (i18n) for error messages
5. **Accessibility improvements** (keyboard navigation, screen readers)

---

For questions or issues, please check the [GitHub Issues](https://github.com/jint2020/dev-knife-web/issues).
