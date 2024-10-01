"use client";

import WikiMenu from "@/components/molecules/WikiMenu/WikiMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <WikiMenu />
      {children}
    </div>
  );
}
