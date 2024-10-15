import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getEventTypeInfo } from "@/utils/eventTypeInfo";

interface EventTypeFilterBadgeProps {
  className?: string;
  eventType: string;
  isSelected: boolean;
  onClick: () => void;
}

export function EventTypeFilterBadge({
  className,
  eventType,
  isSelected,
  onClick,
}: EventTypeFilterBadgeProps) {
  const eventTypeInfo = getEventTypeInfo(eventType);
  const Icon = eventTypeInfo?.icon;

  const colorClass = eventTypeInfo?.color.split(" ")[0];
  const bgColorClass = colorClass?.replace("text-", "bg-");
  const borderColorClass = colorClass?.replace("text-", "border-");

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2",
        isSelected
          ? cn(
              eventTypeInfo?.color,
              `${bgColorClass} bg-opacity-5`,
              `${borderColorClass} border border-opacity-50`,
            )
          : "border-muted bg-transparent text-muted",
        className,
      )}
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {eventType.replace("_", " ")}
    </Button>
  );
}
