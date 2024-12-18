import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getDepartmentInfo } from '@/utils/getDepartmentInfo';

interface DepartmentFilterBadgeProps {
  className?: string;
  department: string;
  isSelected: boolean;
  onClick: () => void;
}

export function DepartmentFilterBadge({
  className,
  department,
  isSelected,
  onClick,
}: DepartmentFilterBadgeProps) {
  const departmentInfo = getDepartmentInfo(department);
  const Icon = departmentInfo?.icon;

  // Extract the color class (e.g., "text-blue-500")
  const colorClass = departmentInfo?.color.split(' ')[0];

  // Create the background color class
  const bgColorClass = colorClass?.replace('text-', 'bg-');

  // Create the border color class
  const borderColorClass = colorClass?.replace('text-', 'border-');

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'flex items-center gap-1 px-4 py-2',
        isSelected
          ? cn(
              departmentInfo?.color,
              bgColorClass ? `${bgColorClass} bg-opacity-5` : '',
              borderColorClass ? `${borderColorClass} border border-opacity-50` : '',
            )
          : 'border-muted bg-transparent text-muted',
        className,
      )}
      onClick={onClick}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {department}
    </Button>
  );
}
