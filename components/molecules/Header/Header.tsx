import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { Sidebar } from '@/components/molecules/Sidebar/Sidebar';

import { UserMenu } from '@/components/molecules/UserMenu/UserMenu';
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';
import { BreadcrumbWithDropdown } from '@/components/molecules/BreadcrumbWithDropdown/BreadcrumbWithDropdown';

export function Header() {
  return (
    <header className='border-b bg-muted/40 h-16'>
      <div className='max-w-6xl mx-auto px-4 h-full'>
        <div className='flex h-full items-center gap-4'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='shrink-0 md:hidden'
              >
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='flex flex-col'>
              <Sidebar isCollapsed={false} />
            </SheetContent>
          </Sheet>
          <div className='w-full flex-1'>
            <BreadcrumbWithDropdown />
          </div>
          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
