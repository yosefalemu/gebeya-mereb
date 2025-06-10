import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["getallusers"],
    queryFn: async () => {
      const response = await client.api.auth.$get();
      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);
        return [];
      }
      const { data } = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });
};
