import { QueryClient, useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { InsertResourceSchemaType } from "../schemas";

type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
};

// Infer the response type from the PATCH endpoint
type ResponseType = InferResponseType<
  (typeof client.api.listings)[":listingId"]["$patch"],
  200
>;

type RequestType = {
  listingId: string;
  json: InsertResourceSchemaType; // Include the form data
};

const queryClient = new QueryClient();

export const useEditListing = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({
      listingId,
      json,
    }: RequestType): Promise<ResponseType> => {
      const response = await client.api.listings[":listingId"].$patch({
        param: { listingId },
        json,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE UPDATING LISTING", errorData);
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
          errorData.message || "An error occurred while updating the listing"
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user-listing"] }); // Updated queryKey to match listings
    },
  });

  return mutation;
};
