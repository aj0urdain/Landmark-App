import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";
import LiveChat from "@/components/molecules/LiveChat/LiveChat";

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
          <Card className="row-span-1 flex h-fit flex-col">
            <CardHeader>
              <CardTitle>Company Events</CardTitle>
              <CardDescription>Upcoming events</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <p className="font-semibold">Portfolio Auction 156</p> */}
            </CardContent>
          </Card>
          <Card className="row-span-1 flex h-fit flex-col">
            <CardHeader>
              <CardTitle>Company Announcements</CardTitle>
              <CardDescription>
                Latest company announcements and news
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <p className="font-semibold">Portfolio Auction 156</p> */}
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
              <CardTitle>Countdown</CardTitle>
              <CardDescription>Time remaining until X</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {/* <p className="text-3xl font-bold">3:45:22</p> */}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3 h-full">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Upcoming Birthdays</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              {/* <ul className="space-y-1">
                <li>Sarah Brown - July 3</li>
                <li>Tom Wilson - July 8</li>
                <li>Emma Davis - July 12</li>
              </ul> */}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-7 h-full">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Burgess Rawson Links & Widgets</CardTitle>
              <CardDescription>
                Quick access to important resources
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default BurgessRawsonDashboard;
