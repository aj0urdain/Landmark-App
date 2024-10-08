"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersPage } from "./users-page";

export default async function PeoplePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>People</CardTitle>
        <CardDescription>
          The layout of this page is still under development!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersPage />
      </CardContent>
    </Card>
  );
}
