"use server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/get-query-client";
import { UsersPage } from "./users-page";
import { getAllUsers } from "./_actions/getAllUsers";

export default async function PeoplePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    ...getAllUsers,
    queryKey: [...getAllUsers.queryKey],
  });

  return (
    <main>
      <h1>Display All Users</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UsersPage />
      </HydrationBoundary>
    </main>
  );
}
