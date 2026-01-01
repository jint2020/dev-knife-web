import * as React from 'react';
import { AlertCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string;
  /**
   * Error description/message
   */
  description?: string;
  /**
   * Custom icon component (defaults to AlertCircle)
   */
  icon?: LucideIcon;
  /**
   * Retry callback - if provided, shows a retry button
   */
  onRetry?: () => void;
  /**
   * Display mode
   * - compact: Small, inline error display (for cards)
   * - full: Full-page error display
   */
  variant?: 'compact' | 'full';
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      title = 'Something went wrong',
      description = 'An unexpected error occurred. Please try again.',
      icon: Icon = AlertCircle,
      onRetry,
      variant = 'compact',
      className,
    },
    ref
  ) => {
    const isCompact = variant === 'compact';

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles with fade-in animation
          'animate-in fade-in-50 duration-300',
          // Layout
          'flex flex-col items-center justify-center text-center',
          // Spacing based on variant
          isCompact ? 'gap-3 p-6' : 'gap-4 p-8 min-h-[300px]',
          className
        )}
        role="alert"
        aria-live="polite"
      >
        {/* Icon */}
        <div
          className={cn(
            'rounded-full bg-destructive/10 flex items-center justify-center',
            isCompact ? 'w-12 h-12' : 'w-16 h-16'
          )}
        >
          <Icon
            className={cn(
              'text-destructive',
              isCompact ? 'w-6 h-6' : 'w-8 h-8'
            )}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className={cn('space-y-2', isCompact ? 'max-w-sm' : 'max-w-md')}>
          <h3
            className={cn(
              'font-semibold text-foreground',
              isCompact ? 'text-base' : 'text-lg'
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                'text-muted-foreground',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {description}
            </p>
          )}
        </div>

        {/* Retry Button */}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size={isCompact ? 'sm' : 'default'}
            className="mt-2"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';
