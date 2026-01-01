import { Component, type ReactNode } from 'react';
import { ErrorState } from '@/components/ui/error-state';

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /**
   * Child components to be wrapped
   */
  children: ReactNode;
  /**
   * Static fallback UI to render on error
   */
  fallback?: ReactNode;
  /**
   * Function to render fallback UI with access to error and reset function
   */
  fallbackRender?: (props: { error: Error; reset: () => void }) => ReactNode;
  /**
   * Callback fired when error boundary catches an error
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /**
   * Callback fired when user attempts to reset the error boundary
   */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors in child component tree and displays a fallback UI.
 * Supports custom fallback rendering and reset functionality.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallbackRender={({ error, reset }) => (
 *     <ErrorState
 *       title="Tool crashed"
 *       description={error.message}
 *       onRetry={reset}
 *     />
 *   )}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Reset the error boundary state
   */
  resetErrorBoundary = (): void => {
    // Call onReset callback if provided
    this.props.onReset?.();

    // Reset state
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, fallbackRender } = this.props;

    if (hasError && error) {
      // Priority 1: Custom fallbackRender function
      if (fallbackRender) {
        return fallbackRender({
          error,
          reset: this.resetErrorBoundary,
        });
      }

      // Priority 2: Static fallback ReactNode
      if (fallback) {
        return fallback;
      }

      // Priority 3: Default ErrorState component
      return (
        <ErrorState
          title="Component Error"
          description={
            process.env.NODE_ENV === 'development'
              ? error.message
              : 'This component encountered an error and could not be displayed.'
          }
          onRetry={this.resetErrorBoundary}
          variant="full"
        />
      );
    }

    return children;
  }
}
