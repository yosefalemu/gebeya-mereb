import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetAllListings = () => {
  const query = useQuery({
    queryKey: ["all-listing"],
    queryFn: async () => {
      const response = await client.api.listings.$get();
      if (!response.ok) {
        throw new Error("An error occurred while fetching the listing");
      }
      const { data } = await response.json();
      return { data };
    },
  });
  return query;
};
