import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // ... other fields
}

export const useCheckLoggedIn = () => {
  return useQuery<User | null>({
    queryKey: ["checkLoggedIn"],
    queryFn: async () => {
      const response = await client.api.auth.loggedin.$get();
      if (!response.ok) {
        if (response.status === 401) {
          return null; // User is not authenticated
        }
        throw new Error(`API Error: ${response.statusText}`);
      }
      const { data } = await response.json();
      return data;
    },
    retry: false, // Disable retries for authentication checks
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
