import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
};

type ResponseType = InferResponseType<
  (typeof client.api.listings)[":listingId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.listings)[":listingId"]["$delete"]
>;

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }): Promise<ResponseType> => {
      const response = await client.api.listings[":listingId"]["$delete"]({
        param,
      });
      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE DELETING LISTING", errorData);
        if (
          typeof errorData.error === "object" &&
          "name" in errorData.error &&
          errorData.error.name === "ZodError"
        ) {
          const errorDataDetail =
            errorData.error.issues[0]?.message || "Validation error occurred";
          throw new Error(errorDataDetail);
        }
        throw new Error(
          errorData.message || "An error occurred while deleting listing"
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-user-listing"] });
    },
  });
  return mutation;
};
