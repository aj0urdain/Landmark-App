import { cn } from "@/lib/utils";

interface DashboardCardRowProps {
  children: React.ReactNode;
  height?: number | string;
}

export function DashboardCardRow({
  children,
  height = 240,
}: DashboardCardRowProps) {
  return (
    <div
      className={cn(
        "grid w-full animate-slide-down-fade-in grid-cols-12 gap-4 overflow-hidden",
      )}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      {children}
    </div>
  );
}
