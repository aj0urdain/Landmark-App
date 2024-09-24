import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

const UpdatesPage = () => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Changelog</CardTitle>
        <CardDescription>
          View the latest updates to the Landmark platform
        </CardDescription>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        <h1 className="text-2xl font-bold">Version 0.1.0</h1>
        <p>- Initial release</p>
      </CardContent>
    </Card>
  );
};

export default UpdatesPage;
