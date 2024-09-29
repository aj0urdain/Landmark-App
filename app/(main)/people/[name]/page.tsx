"use server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/get-query-client";
import { getUserProfilePage } from "./_actions/getUserProfilePage";
import { UserPage } from "./user-page";

export default async function UserProfilePage({
  params,
}: {
  params: { name: string };
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    ...getUserProfilePage,
    queryKey: [...getUserProfilePage.queryKey, params.name],
  });

  return (
    <main>
      <h1>User Profile</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserPage />
      </HydrationBoundary>
    </main>
  );
}
