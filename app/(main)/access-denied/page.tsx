"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userProfileOptions } from "@/types/userProfileTypes";

const AccessDenied = () => {
  const router = useRouter();

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery(userProfileOptions);

  if (isLoading || isError) return <></>;

  return (
    <Card className="flex h-full w-full flex-col items-center justify-center">
      <CardHeader className="flex w-1/2 flex-col items-center justify-center gap-8">
        <ShieldX className="h-48 w-48 text-destructive" />
        <CardTitle className="text-7xl text-destructive">
          Access Denied
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-1/2 flex-col justify-center gap-8 whitespace-pre-line text-pretty text-center">
        <div className="flex flex-col gap-4">
          <p className="text-lg">
            I feel like you&apos;re trying to be somewhere you shouldn&apos;t
            be..{" "}
            <span className="font-extrabold italic">
              but you knew that, didn&apos;t you {userProfile?.first_name}?
            </span>
          </p>
          <p className="text-muted-foreground">
            Turn around{" "}
            <span className="font-bold text-warning-foreground">slowly</span>,
            don&apos;t make any sudden moves, and we&apos;ll pretend it never
            happened.
          </p>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="hoveR:font-bold border-warning-foreground text-warning-foreground transition-all duration-300 hover:bg-warning-foreground hover:text-background"
          onClick={() => router.back()}
        >
          Go back to where I was before..
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccessDenied;
