'use client';

import { useState } from 'react';

import { Sidebar } from '@/components/molecules/Sidebar/Sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Header } from '@/components/molecules/Header/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      <div
        className={`
          relative hidden md:flex flex-col
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-1/2 -right-4 transform -translate-y-1/2 rounded-full shadow-md'
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className='h-4 w-4' />
          ) : (
            <PanelLeftClose className='h-4 w-4' />
          )}
          <span className='sr-only'>Toggle sidebar</span>
        </Button>
      </div>
      <div className='flex flex-col flex-1 overflow-hidden'>
        <Header />
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}

// 'use client';

// import React, { useState } from 'react';

// import { Sidebar } from '@/components/molecules/Sidebar/Sidebar';
// import { Button } from '@/components/ui/button';
// import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
// import { Header } from '@/components/molecules/Header/Header';

// interface MainLayoutProps {
//   children: React.ReactNode;
// }

// export function MainLayout({ children }: MainLayoutProps) {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   };

//   return (
//     <div className='flex h-screen overflow-hidden'>
//       <div
//         className={`
//           relative hidden md:flex flex-col
//           transition-all duration-300 ease-in-out
//           ${isSidebarCollapsed ? 'w-20' : 'w-64'}
//         `}
//       >
//         <Sidebar isCollapsed={isSidebarCollapsed} />
//         <Button
//           variant='ghost'
//           size='icon'
//           className='absolute top-1/2 -right-4 transform -translate-y-1/2 rounded-full shadow-md'
//           onClick={toggleSidebar}
//         >
//           {isSidebarCollapsed ? (
//             <PanelLeftOpen className='h-4 w-4' />
//           ) : (
//             <PanelLeftClose className='h-4 w-4' />
//           )}
//           <span className='sr-only'>Toggle sidebar</span>
//         </Button>
//       </div>
//       <div className='flex flex-col flex-1 overflow-hidden'>
//         <Header />
//         <main className='flex-1 overflow-y-auto'>{children}</main>
//       </div>
//     </div>
//   );
// }