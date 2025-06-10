// ../api/use-accept-status.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ErrorResponse = {
  error?: string;
  message?: string;
};

// Infer the response type from the /approve endpoint
type ResponseType = InferResponseType<
  (typeof client.api.listings)[":listingId"]["approve"],
  200
>;

type RequestType = {
  listingId: string;
};

export const useAcceptStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ listingId }: RequestType): Promise<ResponseType> => {
      const response = await client.api.listings[":listingId"].approve.$patch({
        param: { listingId },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE APPROVING LISTING", errorData);
        throw new Error(
          errorData.message || "An error occurred while approving the listing"
        );
      }

      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      // Invalidate queries to trigger refetch in SendRequest and ReceiveRequest
      queryClient.invalidateQueries({ queryKey: ["send-bookmark"] });
      queryClient.invalidateQueries({ queryKey: ["receive-bookmark"] });
      queryClient.invalidateQueries({ queryKey: ["get-user-listing"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error.message);
    },
  });

  return mutation;
};
