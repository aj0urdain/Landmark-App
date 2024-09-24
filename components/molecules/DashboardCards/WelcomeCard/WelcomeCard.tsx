"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { userProfileOptions } from "@/types/userProfileTypes";

export default function WelcomeCard() {
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery(userProfileOptions);

  if (isLoading) {
    return (
      <Card className="relative h-full w-full overflow-visible p-6">
        <div className="animate-pulse">Loading...</div>
      </Card>
    );
  }

  if (isError || !userProfile) {
    return (
      <Card className="relative h-full w-full overflow-visible p-6">
        <div>Error loading profile or no profile available</div>
      </Card>
    );
  }

  return (
    <Card className="relative h-full w-full overflow-visible p-6">
      <div className="relative z-10 flex h-full w-2/5 animate-slide-down-fade-in flex-col justify-between">
        <div>
          <div className="relative z-10 flex h-full flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              {userProfile?.first_name || "No Name Assigned"}{" "}
              {userProfile?.last_name || "No Name Assigned"}
            </p>
            <h3 className="font-bold">
              {userProfile.roles?.[0] || "No Role Assigned"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {userProfile.branches?.[0] || "No Branch Assigned"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Hello, {userProfile?.first_name || "No Name Assigned"}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Have a great day at work today!
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-2 z-20 h-[100%] w-1/2 animate-slide-down-fade-in overflow-visible">
        <Image
          src={
            userProfile.profile_picture || "/images/default-profile-picture.png"
          }
          alt={`${userProfile.first_name} ${userProfile.last_name}`}
          className="h-full w-auto overflow-y-visible object-cover opacity-100"
          width={200}
          height={200}
        />
      </div>
    </Card>
  );
}
