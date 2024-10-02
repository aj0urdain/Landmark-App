import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const CreatePage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new task</CardTitle>
        <CardDescription>Choose a task to create.</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CreatePage;
