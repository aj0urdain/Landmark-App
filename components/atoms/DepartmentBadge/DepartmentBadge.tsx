import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DepartmentBadgeProps {
  className?: string;
  department: string;
}

export function DepartmentBadge({
  className,
  department,
}: DepartmentBadgeProps) {
  return (
    <Badge
      variant='outline'
      className={cn(
        className,
        'rounded-2xl max-h-6 select-none border-warning-foreground text-warning-foreground'
      )}
    >
      {department}
    </Badge>
  );
}
