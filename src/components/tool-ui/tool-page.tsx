import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ToolPageProps {
  /**
   * The main title of the tool page (e.g., "Base64 Encoder")
   */
  title: string;
  /**
   * A brief description of what the tool does
   */
  description: string;
  /**
   * The tool content (sections, cards, etc.)
   */
  children: ReactNode;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * Standardized page container for all tool pages
 *
 * Provides:
 * - Consistent container width and padding
 * - Unified header layout (title + description)
 * - Responsive spacing
 *
 * Usage:
 * ```tsx
 * <ToolPage
 *   title={t('tools.myTool.title')}
 *   description={t('tools.myTool.description')}
 * >
 *   <ToolSection>...</ToolSection>
 * </ToolPage>
 * ```
 */
export function ToolPage({ title, description, children, className }: ToolPageProps) {
  return (
    <div className={cn('container mx-auto p-6 space-y-6 max-w-5xl', className)}>
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Tool Content */}
      {children}
    </div>
  );
}
