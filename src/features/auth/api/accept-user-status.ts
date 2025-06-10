import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ErrorResponse = {
  error?: string;
  message?: string;
};

// Infer the response type from the /auth/:userId/verify endpoint
type ResponseType = InferResponseType<
  (typeof client.api.auth)[":userId"]["verify"],
  200
>;

type RequestType = {
  userId: string;
};

export const useAcceptUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ userId }: RequestType): Promise<ResponseType> => {
      const response = await client.api.auth[":userId"].verify.$patch({
        param: { userId },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE VERIFYING USER", errorData);
        throw new Error(
          errorData.message || "An error occurred while verifying the user"
        );
      }

      return (await response.json()) as ResponseType;
    },
    onError: (error) => {
      console.error("Mutation error:", error.message);
    },
  });
  queryClient.invalidateQueries({ queryKey: ["getuser"] });
  return mutation;
};
