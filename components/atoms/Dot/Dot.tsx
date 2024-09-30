interface DotProps {
  size: "small" | "large";
  className?: string;
}

export function Dot({ size, className }: DotProps) {
  const sizeClass = size === "small" ? "h-1 w-1" : "h-2 w-2";
  return <div className={`${sizeClass} rounded-full ${className || ""}`} />;
}
