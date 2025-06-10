import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useSendBookmark = () => {
  const query = useQuery({
    queryKey: ["get-send-request"],
    queryFn: async () => {
      try {
        const response = await client.api.bookings.sendBookinRequests.$get();
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(
            errorData.message ||
              "An error occurred while fetching send booking requests"
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
