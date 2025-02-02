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

  const blackLogo = '/images/landmark-logo-black.svg';
  const whiteLogo = '/images/landmark-logo-white.svg';

  const [logoPath, setLogoPath] = useState(blackLogo);

  useEffect(() => {
    setLogoPath(resolvedTheme === 'light' ? blackLogo : whiteLogo);
  }, [resolvedTheme]);

  return (
    <Image
      src={logoPath}
      alt="Landmark Logo"
      width={900}
      height={300}
      className={cn('h-auto', className)}
    />
  );
}
