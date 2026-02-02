import { AlertCircle, RefreshCw } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

export type ErrorMessageProps = {
  error?: Error | null;
  title?: string;
  className?: string;
  variant?: 'default' | 'inline';
  onRetry?: () => void;
};

export function ErrorMessage({
  error,
  title = 'Error',
  className,
  variant = 'default',
  onRetry,
}: ErrorMessageProps) {
  if (!error) return null;

  if (variant === 'inline') {
    return (
      <p className={cn('text-sm text-destructive', className)}>
        {error.message}
      </p>
    );
  }

  return (
    <Alert variant="destructive" className={cn('', className)}>
      <AlertCircle className="h-5 w-5" />
      <div className="flex-1">
        <AlertTitle className="text-base font-semibold mb-2">
          {title}
        </AlertTitle>
        <AlertDescription className="text-sm leading-relaxed">
          {error.message}
        </AlertDescription>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="ml-auto border-destructive/30 hover:bg-destructive/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
    </Alert>
  );
}
