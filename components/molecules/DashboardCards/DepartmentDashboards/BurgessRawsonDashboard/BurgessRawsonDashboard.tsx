import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";
import LiveChat from "@/components/molecules/LiveChat/LiveChat";
import { Bell, Cake, Calendar, Link2, Timer } from "lucide-react";

const initialMessages = [
  {
    id: 1,
    sender: "John Doe",
    content: "Has anyone seen the latest market report?",
    timestamp: new Date(),
  },
  {
    id: 2,
    sender: "Jane Smith",
    content: "I'll be presenting at the next team meeting.",
    timestamp: new Date(),
  },
  {
    id: 3,
    sender: "Mike Johnson",
    content: "Great job on the recent sale, team!",
    timestamp: new Date(),
  },
];

const BurgessRawsonDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Burgess Rawson" isLast={isLast}>
      <DashboardCardRow height={420}>
        <div className="col-span-7 flex h-full flex-col gap-4">
          <Card className="row-span-1 flex h-1/2 flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Company Events
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col text-sm text-muted">
              <p>Possible table of events?</p>
              <p>
                May include filter to change upcoming events via day/week/month
              </p>
            </CardContent>
          </Card>
          <Card className="row-span-1 flex h-1/2 flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Bell className="h-3 w-3" />
                Company Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col text-sm text-muted">
              <p>Either show card or multiple cards</p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-5 h-full">
          <LiveChat
            chatName="Company"
            height={420}
            initialMessages={initialMessages}
          />
        </div>
      </DashboardCardRow>
      <DashboardCardRow>
        <div className="col-span-2 h-full">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Timer className="h-3 w-3" />
                Countdown
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-sm text-muted">
              <p>
                choose event to display interactive countdown, otherwise default
                to next company event
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3 h-full">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Cake className="h-3 w-3" />
                Birthdays
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              <p>
                Table of birthdays with name, role, and age.
                <br />
                <br />
                Add a filter to change birthdays via day/week/month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-7 h-full">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Link2 className="h-3 w-3" />
                Links and Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              <p>
                Links to commonly used websites and applications, could either
                be icons with floating tooltips or a table?
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default BurgessRawsonDashboard;
