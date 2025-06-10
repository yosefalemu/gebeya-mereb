import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

// Define the expected error response structure
type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};

type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
};

type ResponseType = InferResponseType<
  (typeof client.api.auth)[":userId"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)[":userId"]["$patch"]
> & {
  id: string;
};

export const useUpdateUser = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ id, json }) => {
      const response = await client.api.auth[":userId"]["$patch"]({
        param: { userId: id },
        json,
      });
      if (!response.ok) {
        const errorJson = await response.json();
        if (
          errorJson &&
          typeof errorJson === "object" &&
          ("error" in errorJson || "message" in errorJson)
        ) {
          const errorData = errorJson as ErrorResponse;
          if (
            typeof errorData.error === "object" &&
            errorData.error !== null &&
            "name" in errorData.error &&
            (errorData.error as ZodErrorDetail).name === "ZodError"
          ) {
            const errorMessage =
              (errorData.error as ZodErrorDetail).issues[0]?.message ||
              "Validation error occurred";
            throw new Error(errorMessage);
          }
          throw new Error(
            errorData.message || "An error occurred while updating the user"
          );
        }
        throw new Error("An unknown error occurred while updating the user");
      }
      const data: ResponseType = await response.json();
      return data;
    },
  });
  return mutation;
};
