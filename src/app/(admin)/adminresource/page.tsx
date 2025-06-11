"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllListings } from "@/features/listings/api/all-listings";
import { Edit, FolderOpen } from "lucide-react";
import Link from "next/link";
export default function AdminResourcePage() {
  const { data: users, isLoading, isFetching, error } = useGetAllListings();

  if (isLoading || isFetching) {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[120px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[180px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[50px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  if (error) {
    return <div>Error</div>;
  }

  console.log("ALL USERS", users);
  return (
    <div>
      {users?.data.length === 0 ? (
        <div className="h-[250px] w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-y-2 bg-gray-50 p-6 rounded-full">
            <FolderOpen className="size-24" />
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data.map((item) => (
              <TableRow key={item.id || item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.rate}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>
                  {item.availability === "PENDING"
                    ? "ACTIVE"
                    : item.availability}
                </TableCell>
                <TableCell>
                  <Link href={`/adminresource/${item.id}`}>
                    <Edit className="text-yellow-300 hover:text-yellow-700" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
