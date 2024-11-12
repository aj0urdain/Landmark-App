import { Inbox as InboxIcon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { Sidebar } from '@/components/molecules/Sidebar/Sidebar';

import { UserMenu } from '@/components/molecules/UserMenu/UserMenu';

import { BreadcrumbWithDropdown } from '@/components/molecules/BreadcrumbWithDropdown/BreadcrumbWithDropdown';
import { Inbox } from '@/components/molecules/Inbox/Inbox';

export function Header() {
  return (
    <header className="h-16 border-b bg-muted/40">
      <div className="mx-auto h-full max-w-6xl px-4">
        <div className="flex h-full items-center justify-between gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 xl:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-72 flex-col justify-start border-none p-0"
              showClose={false}
            >
              <Sidebar isCollapsed={false} sheetMode />
            </SheetContent>
          </Sheet>
          <div className="hidden w-full flex-1 xl:block">
            <BreadcrumbWithDropdown />
          </div>
          <div className="flex items-center gap-2">
            <UserMenu />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 xl:hidden">
                <InboxIcon className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-fit flex-col justify-end border-none p-0"
              showClose={false}
            >
              <Inbox isCollapsed={false} sheetMode toggleSidebar={() => {}} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
