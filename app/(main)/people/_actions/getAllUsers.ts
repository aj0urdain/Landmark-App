import { queryOptions } from "@tanstack/react-query";
import { selectAllUsers } from "@/utils/use-cases/all-users/all-users";

export const getAllUsers = queryOptions({
  queryKey: ["allUsers"],
  queryFn: async () => {
    return await selectAllUsers();
  },
});
