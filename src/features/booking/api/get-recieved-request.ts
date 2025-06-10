import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useRequestBookmark = () => {
  const query = useQuery({
    queryKey: ["get-recieved-request"],
    queryFn: async () => {
      try {
        const response =
          await client.api.bookings.receiveBookingRequests.$get();
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(
            errorData.message ||
              "An error occurred while fetching received booking requests"
          );
        }
        const { data } = await response.json();
        return data;
      } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
      }
    },
  });
  return query;
};
