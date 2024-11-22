'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
}

export function LandmarkLogo({ className }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [shouldInvert, setShouldInvert] = useState(false);

  const blackLogo = '/images/landmark-logo-black.svg';
  const whiteLogo = '/images/landmark-logo-white.svg';

  const [logoPath, setLogoPath] = useState(blackLogo);

  useEffect(() => {
    // resolvedTheme will be either 'light' or 'dark', even when theme is 'system'
    setShouldInvert(resolvedTheme === 'light');
    setLogoPath(resolvedTheme === 'light' ? blackLogo : whiteLogo);
  }, [resolvedTheme]);

  return (
    <Image
      src={logoPath}
      alt="Landmark Logo"
      width={900}
      height={300}
      className={cn('h-auto', shouldInvert && 'invert', className)}
    />
  );
}
