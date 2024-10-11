"use client";

import React from "react";

import { CompanyCalendar } from "@/components/molecules/CompanyCalendar/CompanyCalendar";

const EventsPage = () => {
  return (
    <div className="w-full p-4">
      <div className="grid h-full grid-cols-1 gap-4">
        <CompanyCalendar />
      </div>
    </div>
  );
};

export default EventsPage;
