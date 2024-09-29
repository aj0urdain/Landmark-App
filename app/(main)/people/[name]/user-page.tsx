"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserProfilePage } from "./_actions/getUserProfilePage";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function UserPage() {
  const params = useParams();
  const name = params.name as string;

  const { data, isLoading, isError } = useSuspenseQuery({
    ...getUserProfilePage,
    queryKey: [...getUserProfilePage.queryKey, name],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error loading user profile</div>;
  }

  return (
    <Card>
      <p>First Name: {data.first_name}</p>
      <p>Last Name: {data.last_name}</p>
      <p>Email: {data.email}</p>
      {data.canEdit && <Button>Edit Profile</Button>}
    </Card>
  );
}
