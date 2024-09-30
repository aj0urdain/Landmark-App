"use server";

import { UsersPage } from "./users-page";

export default async function PeoplePage() {
  return (
    <main>
      <UsersPage />
    </main>
  );
}
