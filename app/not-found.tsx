"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldQuestion } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const NotFoundPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-w-screen flex h-full min-h-screen w-full flex-col items-center justify-center gap-8">
      <Card className="border-warning-foreground/50">
        <CardHeader className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2 text-7xl font-extrabold text-warning-foreground">
            <ShieldQuestion className="h-28 w-28" />
            404
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Look, I don&apos;t know what you&apos;re looking for, but I can tell
            you one thing.
          </p>
          <p className="text-muted-foreground">
            Burgess Rawson does not have a page for {pathname} over here.
          </p>
        </CardContent>
      </Card>
      <p className="text-xs text-warning-foreground">
        If you think this is an error, please contact the Burgess Rawson
        Technology team.
      </p>
      <div className="flex gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          Go back
        </Button>
        <Button onClick={() => router.push("/")}>Go home</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
