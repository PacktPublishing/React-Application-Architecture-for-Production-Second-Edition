import { cn } from '@/lib/utils';

import { Card, CardContent } from './ui/card';

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        {icon && (
          <div className="mb-6 text-muted-foreground/50 [&>svg]:w-16 [&>svg]:h-16">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
        {description && (
          <p className="text-base text-muted-foreground mb-6 max-w-md leading-relaxed">
            {description}
          </p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </CardContent>
    </Card>
  );
}
