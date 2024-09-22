"use client";

import { useState } from "react";

import { Sidebar } from "@/components/molecules/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Header } from "@/components/molecules/Header/Header";
import { UserProfileManager } from "@/components/atoms/UserProfileManager/UserProfileManager";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <UserProfileManager />
      <div
        className={`relative hidden flex-col transition-all duration-300 ease-in-out md:flex ${isSidebarCollapsed ? "w-20" : "w-64"} `}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-1/2 -translate-y-1/2 transform rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="mx-4 flex h-full w-full items-center justify-center overflow-y-scroll py-4 2xl:mx-auto">
          <div className="h-full w-full max-w-6xl">{children}</div>
        </main>
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
