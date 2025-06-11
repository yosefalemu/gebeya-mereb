"use client";
import { useGetAllUsers } from "@/features/auth/api/get-all-users";
import { useGetAllListings } from "@/features/listings/api/all-listings";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";

export default function AdminHomePage() {
  const { data: users, isLoading: isUsersLoading } = useGetAllUsers();
  const { data: listings, isLoading: isListingsLoading } = useGetAllListings();

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalUsers = users?.length || 0;
    const activeUsers =
      users?.filter((u) => u.businessStatus === "ACTIVE").length || 0;
    const pendingUsers =
      users?.filter((u) => u.businessStatus === "PENDING").length || 0;
    const totalListings = listings?.data?.length || 0;
    const activeListings =
      listings?.data?.filter((l) => l.availability === "PENDING").length || 0;

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      totalListings,
      activeListings,
    };
  }, [users, listings]);

  if (isUsersLoading || isListingsLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6 flex justify-center flex-col items-center">
            <div className="text-3xl font-bold text-blue-700 text-center">
              {metrics.totalUsers}
            </div>
            <h1 className="text-blue-600">Total Users</h1>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 flex justify-center flex-col items-center">
            <div className="text-3xl font-bold text-green-700 text-center">
              {metrics.activeUsers}
            </div>
            <h1 className="text-green-600">Active Users</h1>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6 flex justify-center flex-col items-center">
            <div className="text-3xl font-bold text-purple-700 text-center">
              {metrics.totalListings}
            </div>
            <h1 className="text-purple-600">Total Resources</h1>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6 flex justify-center flex-col items-center">
            <div className="text-3xl font-bold text-orange-700 text-center">
              {metrics.activeListings}
            </div>
            <h1 className="text-orange-600">Active Resources</h1>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
