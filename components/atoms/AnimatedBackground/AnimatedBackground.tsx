import React from 'react';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  colors: string[];
  className?: string;
  active?: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  colors,
  className,
  active,
}) => {
  const gradientColors = colors.join(', ');

  return (
    <div className={`relative ${className ?? ''}`}>
      <div
        className={`absolute inset-0 overflow-hidden -z-10 ${active ? 'animate-gradient-animation' : ''} ${className ?? ''}`}
        style={{
          backgroundImage: active ? `linear-gradient(45deg, ${gradientColors})` : 'none',
          backgroundColor: !active ? 'transparent' : 'none',
          backgroundSize: active ? '200% 200%' : '0% 0%',
        }}
      />
      {children}
    </div>
  );
};
