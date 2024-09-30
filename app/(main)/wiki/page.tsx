import { Dot } from "@/components/atoms/Dot/Dot";
import { LogoWordmark } from "@/components/atoms/LogoWordmark/LogoWordmark";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import React from "react";

const WikiPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <LogoWordmark className="h-10 w-auto" />
            <Dot size="small" className="mt-1 animate-pulse bg-foreground" />
            <h1 className="mt-1 font-lexia text-xl font-bold uppercase tracking-wider">
              Wiki
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Departments</Button>
            <Button variant="ghost">Branches</Button>
          </div>
        </CardTitle>
        <CardDescription>This is the wiki page.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Welcome to Burgess Rawson!</h2>
            <p className="text-sm text-muted-foreground">
              This is the wiki page.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WikiPage;
