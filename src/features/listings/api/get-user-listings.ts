import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetMembers = () => {
  const query = useQuery({
    queryKey: ["get-user-listing"],
    queryFn: async () => {
      const response = await client.api.listings["get-user-listings"].$get();
      if (!response.ok) {
        throw new Error("An error occurred while fetching user listings");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
