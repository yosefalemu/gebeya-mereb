"use client";

import { useGetUser } from "@/features/auth/api/get-user";
import { useSearchParams } from "next/navigation";

export default function CompanyPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  console.log("User ID:", userId);
  const { data, isLoading, isError } = useGetUser(userId!);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading user data.</div>;
  }
  return (
    <div className="h-full flex flex-col py-4 gap-y-6">
      <h1 className="text-2xl font-bold">Company Dashboard</h1>
      <p>
        Welcome to the company dashboard. Here you can manage your information
        and settings.
      </p>
      {JSON.stringify(data)}
    </div>
  );
}
