import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["getuser", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const response = await client.api.auth[":userId"].$get({
        param: { userId },
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const { data } = await response.json();
      return data;
    },
    enabled: !!userId,
    retry: 1,
    retryDelay: 1000,
  });
};
