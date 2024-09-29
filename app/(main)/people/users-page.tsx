"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { getAllUsers } from "./_actions/getAllUsers";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

export function UsersPage() {
  const { data, isLoading, isError } = useSuspenseQuery({
    ...getAllUsers,
    queryKey: [...getAllUsers.queryKey],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error loading user profile</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map((user) => (
          <Link
            href={`/people/${user.first_name}-${user.last_name}`}
            key={user.id}
          >
            <Card key={user.id} className="p-4">
              <p className="text-lg font-bold">
                {user.first_name} {user.last_name}
              </p>

              <p className="text-sm text-muted-foreground">{user.email}</p>

              <div className="flex gap-1">
                {user?.departments?.map((department: string) => (
                  <p key={department} className="text-sm text-muted-foreground">
                    {department} |
                  </p>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
