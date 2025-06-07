import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
if (!baseUrl) {
  console.error("NEXT_PUBLIC_APP_URL is undefined");
  throw new Error("Hono client base URL is not configured");
}
console.log("Hono client baseUrl:", baseUrl);

export const client = hc<AppType>(baseUrl);