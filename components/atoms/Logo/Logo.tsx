'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [shouldInvert, setShouldInvert] = useState(false);

  useEffect(() => {
    // resolvedTheme will be either 'light' or 'dark', even when theme is 'system'
    setShouldInvert(resolvedTheme === 'light');
  }, [resolvedTheme]);

  return (
    <Image
      src="/images/burgess-rawson-logo.svg"
      alt="Burgess Rawson Logo"
      width={900}
      height={300}
      className={cn('h-auto', shouldInvert && 'invert', className)}
    />
  );
}
