'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
}

export function LandmarkLogoWordmark({ className }: LogoProps) {
  const { resolvedTheme } = useTheme();

  const blackLogo = '/images/landmark-symbol-wordmark-black.svg';
  const whiteLogo = '/images/landmark-symbol-wordmark-white.svg';

  const [logoPath, setLogoPath] = useState(blackLogo);

  useEffect(() => {
    setLogoPath(resolvedTheme === 'light' ? blackLogo : whiteLogo);
  }, [resolvedTheme]);

  return (
    <Image
      src={logoPath}
      alt="Landmark Logo and Wordmark"
      width={900}
      height={300}
      className={cn('h-auto', className)}
    />
  );
}
