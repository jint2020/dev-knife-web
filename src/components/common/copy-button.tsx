import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';

export interface CopyButtonProps {
  /**
   * The text content to copy to clipboard
   */
  value: string;
  /**
   * Button variant style
   */
  variant?: ButtonProps['variant'];
  /**
   * Button size
   */
  size?: ButtonProps['size'];
  /*
  disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Display mode: icon-only or with-label
   * @default 'with-label'
   */
  mode?: 'icon-only' | 'with-label';
  /**
   * Duration in milliseconds to show the success state
   * @default 2000
   */
  successDuration?: number;
  /**
   * Optional callback when copy succeeds
   */
  onCopySuccess?: () => void;
  /**
   * Optional callback when copy fails
   */
  onCopyError?: (error: Error) => void;
}

/**
 * A reusable copy-to-clipboard button component with automatic feedback
 *
 * Features:
 * - Automatic clipboard write with Web API
 * - Visual feedback (icon changes from Copy to Check)
 * - Configurable success duration
 * - Supports icon-only and with-label modes
 * - i18n support
 */
export function CopyButton({
  value,
  variant = 'outline',
  size = 'sm',
  disabled = false,
  className,
  mode = 'with-label',
  successDuration = 2000,
  onCopySuccess,
  onCopyError,
}: CopyButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopySuccess?.();

      setTimeout(() => {
        setCopied(false);
      }, successDuration);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to copy to clipboard');
      console.error('Copy failed:', error);
      onCopyError?.(error);
    }
  };

  if (mode === 'icon-only') {
    return (
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={handleCopy}
        className={className}
        title={copied ? t('common.copied') : t('common.copy')}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 mr-2" />
          {t('common.copied')}
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 mr-2" />
          {t('common.copy')}
        </>
      )}
    </Button>
  );
}
