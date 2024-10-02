"use client";

import CreateMenu from "@/components/molecules/CreateMenu/CreateMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <CreateMenu />
      {children}
    </div>
  );
}
