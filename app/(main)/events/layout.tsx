import EventsMenu from "@/components/molecules/EventMenu/EventMenu";
import React from "react";

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <EventsMenu />
      <div className="p-4">{children}</div>
    </div>
  );
}
