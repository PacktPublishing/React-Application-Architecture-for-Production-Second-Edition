import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({
  className,
  onFocus,
  ...props
}: React.ComponentProps<'textarea'>) {
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onFocus?.(e);

    const textarea = e.currentTarget;
    setTimeout(() => {
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }, 0);
  };
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      onFocus={handleFocus}
      {...props}
    />
  );
}

export { Textarea };
