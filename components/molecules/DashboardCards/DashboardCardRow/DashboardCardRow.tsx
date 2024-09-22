import { cn } from "@/lib/utils";

interface DashboardCardRowProps {
  children: React.ReactNode;
  topRow?: boolean;
}

export function DashboardCardRow({
  children,
  topRow = false,
}: DashboardCardRowProps) {
  return (
    <div
      className={cn(
        "grid h-full w-full grid-cols-12 gap-4",
        topRow ? "max-h-[320px]" : "max-h-[275px]",
      )}
    >
      {children}
    </div>
  );
}
