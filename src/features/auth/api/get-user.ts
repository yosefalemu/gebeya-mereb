import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetUser = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ["getuser"],
    queryFn: async () => {
      if (!userId) {
        throw new Error("Listing id is required");
      }
      const response = await client.api.auth[":userId"].$get({
        param: { userId },
      });
      if (!response.ok) {
        return null;
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
