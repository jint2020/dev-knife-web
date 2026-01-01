import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, FileWarning } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';

/**
 * File validation error types
 */
export type FileValidationError =
  | 'file-too-large'
  | 'invalid-type'
  | 'no-file'
  | 'unknown';

/**
 * Props for FileDropZone component
 */
export interface FileDropZoneProps {
  /**
   * Callback fired when a valid file is selected
   */
  onFileSelect: (file: File) => void;
  /**
   * Accepted MIME types (e.g., "image/*", "image/png,image/jpeg")
   */
  accept?: string;
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  /**
   * Custom title text
   */
  title?: string;
  /**
   * Custom description text
   */
  description?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file type matches accept pattern
 */
function isFileTypeAccepted(file: File, accept: string): boolean {
  const acceptedTypes = accept.split(',').map((t) => t.trim());

  return acceptedTypes.some((type) => {
    // Wildcard matching (e.g., "image/*")
    if (type.endsWith('/*')) {
      const baseType = type.split('/')[0];
      return file.type.startsWith(baseType + '/');
    }
    // Exact match (e.g., "image/png")
    return file.type === type;
  });
}

/**
 * FileDropZone Component
 *
 * Universal file upload component with drag-and-drop support.
 * Handles file validation (size, type) and displays errors using ErrorState.
 *
 * @example
 * ```tsx
 * <FileDropZone
 *   onFileSelect={(file) => console.log(file)}
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   title="Upload Image"
 *   description="Drag and drop or click to select"
 * />
 * ```
 */
export function FileDropZone({
  onFileSelect,
  accept = '*/*',
  maxSize,
  title = 'Upload File',
  description = 'Drag and drop or click to select a file',
  className,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<{
    type: FileValidationError;
    message: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Validate file against constraints
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      return {
        valid: false,
        error: `File size (${formatBytes(file.size)}) exceeds the maximum allowed size of ${formatBytes(maxSize)}.`,
      };
    }

    // Check file type
    if (accept !== '*/*' && !isFileTypeAccepted(file, accept)) {
      const acceptedFormats = accept
        .split(',')
        .map((t) => t.trim())
        .join(', ');
      return {
        valid: false,
        error: `File type "${file.type || 'unknown'}" is not supported. Accepted formats: ${acceptedFormats}`,
      };
    }

    return { valid: true };
  };

  /**
   * Handle file selection
   */
  const handleFile = (file: File | null) => {
    if (!file) {
      setError({
        type: 'no-file',
        message: 'No file was selected. Please try again.',
      });
      return;
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      setError({
        type: file.size > (maxSize || Infinity) ? 'file-too-large' : 'invalid-type',
        message: validation.error!,
      });
      return;
    }

    // Clear error and notify parent
    setError(null);
    onFileSelect(file);
  };

  /**
   * Handle drag events
   */
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  /**
   * Handle retry (reset error state)
   */
  const handleRetry = () => {
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className={cn('rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/5', className)}>
        <ErrorState
          icon={FileWarning}
          title="File Upload Error"
          description={error.message}
          onRetry={handleRetry}
          variant="compact"
        />
      </div>
    );
  }

  /**
   * Render upload zone
   */
  return (
    <div
      className={cn(
        'relative rounded-lg border-2 border-dashed transition-all duration-200',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border bg-muted/50 hover:bg-muted hover:border-muted-foreground/50',
        'cursor-pointer',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        {/* Icon */}
        <div
          className={cn(
            'rounded-full p-4 transition-colors',
            isDragging ? 'bg-primary/10' : 'bg-muted'
          )}
        >
          <Upload
            className={cn(
              'w-8 h-8 transition-colors',
              isDragging ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold text-foreground">
            {isDragging ? 'Drop file to upload' : title}
          </h4>
          <p className="text-sm text-muted-foreground max-w-xs">
            {isDragging ? 'Release to select this file' : description}
          </p>
        </div>

        {/* Constraints */}
        {(maxSize || accept !== '*/*') && (
          <div className="text-xs text-muted-foreground space-y-1">
            {accept !== '*/*' && <p>Accepted formats: {accept}</p>}
            {maxSize && <p>Maximum size: {formatBytes(maxSize)}</p>}
          </div>
        )}

        {/* Click to upload hint */}
        {!isDragging && (
          <Button variant="outline" size="sm" type="button" onClick={(e) => e.stopPropagation()}>
            Browse Files
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        aria-label="File upload input"
      />
    </div>
  );
}
