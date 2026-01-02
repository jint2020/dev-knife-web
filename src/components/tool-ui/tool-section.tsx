import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ToolSectionProps {
  /**
   * Optional section title (displays in the header) - can be string or ReactNode for flexibility
   */
  title?: ReactNode;
  /**
   * Optional description text (displays below title)
   */
  description?: string;
  /**
   * The main content of the section
   */
  children: ReactNode;
  /**
   * Optional action buttons (e.g., Copy, Download) - displays in top-right of header
   */
  actions?: ReactNode;
  /**
   * Additional CSS classes for the Card container
   */
  className?: string;
  /**
   * Additional CSS classes for the CardContent
   */
  contentClassName?: string;
}

/**
 * Standardized content section for tool pages
 *
 * Features:
 * - Built on Shadcn Card component for consistent styling
 * - Optional header with title, description, and action buttons
 * - Flexible content area
 * - Used to separate logical sections (Input, Output, Settings, Info)
 *
 * Usage:
 * ```tsx
 * // With full header
 * <ToolSection
 *   title="Input"
 *   description="Enter your text here"
 *   actions={<CopyButton value={text} />}
 * >
 *   <textarea />
 * </ToolSection>
 *
 * // Content-only (no header)
 * <ToolSection>
 *   <div>Some content</div>
 * </ToolSection>
 * ```
 */
export function ToolSection({
  title,
  description,
  children,
  actions,
  className,
  contentClassName,
}: ToolSectionProps) {
  const hasHeader = title || description || actions;

  return (
    <Card className={className}>
      {hasHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {actions && <div className="flex items-center gap-2 ml-4">{actions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(hasHeader ? '' : 'pt-6', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
