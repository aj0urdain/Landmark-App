interface DotProps {
  size: 'small' | 'large';
}

export function Dot({ size }: DotProps) {
  const sizeClass = size === 'small' ? 'h-1 w-1' : 'h-2 w-2';
  return <div className={`${sizeClass} rounded-full bg-white`} />;
}
