import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetListing = (listingId: string | undefined) => {
  const query = useQuery({
    queryKey: ["get-listing", listingId],
    queryFn: async () => {
      if (!listingId) {
        throw new Error("Listing id is required");
      }
      const response = await client.api.listings[":listingId"].$get({
        param: { listingId },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching the listing");
      }
      const { data, relatedListings } = await response.json();
      return { data, relatedListings };
    },
  });
  return query;
};
