import { getQueryClient } from "@/utils/get-query-client";

export function clearQueryCache() {
  const queryClient = getQueryClient();
  queryClient.clear();
}
