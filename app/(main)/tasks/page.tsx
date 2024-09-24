import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import React from "react";

const TasksPage = () => {
  return (
    <Card className="flex h-full w-full flex-col gap-2 p-6">
      <CardTitle>Tasks</CardTitle>
      <CardDescription>
        Here you can view and manage your tasks.
      </CardDescription>
    </Card>
  );
};

export default TasksPage;
