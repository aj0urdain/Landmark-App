"use client";

import React from "react";
import { Card } from "@/components/ui/card";

import { CompanyCalendar } from "@/components/molecules/CompanyCalendar/CompanyCalendar";

const EventsPage = () => {
  return (
    <Card className="w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Company Events</h1>
      <div className="grid h-full grid-cols-1 gap-4">
        <CompanyCalendar />
      </div>
    </Card>
  );
};

export default EventsPage;
