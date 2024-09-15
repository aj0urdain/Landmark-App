'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Laptop, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm'>
          {theme === 'light' ? (
            <Sun
              key='light'
              size={ICON_SIZE}
              className='text-muted-foreground'
            />
          ) : theme === 'dark' ? (
            <Moon
              key='dark'
              size={ICON_SIZE}
              className='text-muted-foreground'
            />
          ) : (
            <Laptop
              key='system'
              size={ICON_SIZE}
              className='text-muted-foreground'
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem className='flex gap-2' value='light'>
            <Sun size={ICON_SIZE} className='text-muted-foreground' />{' '}
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className='flex gap-2' value='dark'>
            <Moon size={ICON_SIZE} className='text-muted-foreground' />{' '}
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className='flex gap-2' value='system'>
            <Laptop size={ICON_SIZE} className='text-muted-foreground' />{' '}
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
