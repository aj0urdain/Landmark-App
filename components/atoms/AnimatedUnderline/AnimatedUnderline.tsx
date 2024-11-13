interface AnimatedUnderlineProps {
  children: React.ReactNode;
  thickness?: number;
  color?: string;
  duration?: number;
  direction?: 'left' | 'center';
  className?: string;
}

export function AnimatedUnderline({
  children,
  thickness = 2,
  color = 'current',
  duration = 300,
  direction = 'left',
  className = '',
}: AnimatedUnderlineProps) {
  const baseClasses = `relative after:absolute after:bottom-0 after:left-0 after:w-full after:transition-transform after:duration-[${String(duration)}ms]`;
  const thicknessClass = `after:h-[${String(thickness)}px]`;
  const colorClass = `after:bg-${color}`;
  const directionClasses =
    direction === 'left'
      ? 'after:origin-bottom-right hover:after:origin-bottom-left'
      : 'after:origin-center';
  const transformClass = 'after:scale-x-0 hover:after:scale-x-100';

  return (
    <span
      className={`${baseClasses} ${thicknessClass} ${colorClass} ${directionClasses} ${transformClass} ${className}`}
    >
      {children}
    </span>
  );
}
