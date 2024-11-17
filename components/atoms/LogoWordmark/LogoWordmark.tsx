'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface LogoWordmarkProps {
  className?: string;
}

export function LogoWordmark({ className }: LogoWordmarkProps) {
  const { resolvedTheme } = useTheme();
  const [shouldInvert, setShouldInvert] = useState(false);

  useEffect(() => {
    setShouldInvert(resolvedTheme === 'light');
  }, [resolvedTheme]);

  return (
    <Image
      src="/images/burgess-rawson-symbol-and-wordmark.svg"
      alt="Burgess Rawson Logo"
      width={900}
      height={300}
      className={cn('h-auto w-full', shouldInvert && 'invert', className)}
    />
  );
}
