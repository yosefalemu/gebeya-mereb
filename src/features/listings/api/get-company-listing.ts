import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetCompanyListings = (companyId: string | undefined) => {
  const query = useQuery({
    queryKey: ["get-company-listings", companyId],
    queryFn: async () => {
      if (!companyId) {
        throw new Error("Company ID is required");
      }
      try {
        const response = await client.api.listings["company-listings"][
          ":companyId"
        ].$get({
          param: { companyId },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(
            errorData.message ||
              "An error occurred while fetching company listings"
          );
        }
        const { data } = await response.json();
        return data;
      } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
      }
    },
    enabled: !!companyId,
  });
  return query;
};
