import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, FolderOpen, PenLine, Trash2 } from "lucide-react";
import Image from "next/image";
import { SelectResourceSchemaType } from "../schemas";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteListing } from "@/features/listings/api/delete-listing";
import { toast } from "sonner";

interface MyListingsItemsProps {
  isLoading: boolean;
  isError: boolean;
  data: SelectResourceSchemaType[];
}

type ListingStatus =
  | "PENDING"
  | "SOLD"
  | "RESERVED"
  | "UNAVAILABLE"
  | "ARCHIVED";

export default function MyListingsItems({
  isError,
  isLoading,
  data,
}: MyListingsItemsProps) {
  const router = useRouter();
  const deleteMutation = useDeleteListing();
  const [deletingListingId, setDeletingListingId] = useState<string | null>(
    null
  );

  const statusColors: Record<ListingStatus, string> = {
    PENDING: "bg-green-100 text-green-800",
    SOLD: "bg-red-100 text-red-800",
    RESERVED: "bg-yellow-100 text-yellow-800",
    UNAVAILABLE: "bg-blue-100 text-blue-800",
    ARCHIVED: "bg-gray-100 text-gray-800",
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Listing",
    "Are you sure you want to remove this listing? This action cannot be undone.",
    {
      variant: "destructive",
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
    }
  );

  const handleRemoveMember = async (listingId: string) => {
    setDeletingListingId(listingId); // Open modal by setting the ID
    const ok = await confirm();
    if (!ok) {
      setDeletingListingId(null); // Close modal on cancel
      return;
    }

    deleteMutation.mutate(
      {
        param: { listingId },
      },
      {
        onSuccess: () => {
          toast.success("Listing removed successfully");
          setDeletingListingId(null); // Close modal only on success
        },
        onError: () => {
          toast.error("Failed to remove listing");
          setDeletingListingId(null); // Close modal on error
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-x-4 bg-white rounded-xl shadow-sm border border-gray-200 h-40"
          >
            <Skeleton className="w-64 h-40 rounded-tl-xl rounded-bl-xl rounded-tr-sm rounded-br-sm" />
            <div className="flex-1">
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-2" />
            </div>
            <div className="flex space-x-2 h-full flex-col justify-between items-end p-2">
              <Skeleton className="w-20 h-6 rounded-full" />
              <div className="flex gap-x-2">
                <Skeleton className="w-20 h-8 rounded-3xl" />
                <Skeleton className="w-20 h-8 rounded-3xl" />
                <Skeleton className="w-20 h-8 rounded-3xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center">
        <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
        <Skeleton className="h-4 w-1/4 mx-auto" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[450px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-y-2 bg-gray-50 p-6 rounded-full">
          <FolderOpen className="size-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      {deletingListingId && <ConfirmDialog />}
      {data.map((listing) => (
        <div
          key={listing.id}
          className="flex items-center gap-x-4 bg-white rounded-xl shadow-sm border border-gray-200 h-40"
        >
          <div className="w-64 h-40 rounded relative">
            <Image
              src={listing.thumbnailImage ?? "/images/workspace.png"}
              fill
              alt={listing.name}
              className="rounded-tl-xl rounded-bl-xl rounded-tr-sm rounded-br-sm object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{listing.name}</h3>
            <p className="text-sm text-gray-600">
              Category: {listing.category}
            </p>
            <p className="text-sm text-gray-600">
              Price: {listing.currency} {listing.price} per day
            </p>
            <p className="text-sm text-gray-600">
              Date Posted:
              {(() => {
                const date =
                  typeof listing.createdAt === "string"
                    ? new Date(listing.createdAt)
                    : listing.createdAt;
                return date instanceof Date && !isNaN(date.getTime())
                  ? date.toLocaleDateString()
                  : String(listing.createdAt);
              })()}
            </p>
          </div>
          <div className="flex space-x-2 h-full flex-col justify-between items-end p-2">
            <span
              className={`px-6 py-1 text-xs font-medium rounded-full flex items-center justify-center w-fit ${
                statusColors[listing.availability]
              }`}
            >
              {listing.availability === "PENDING"
                ? "ACTIVE"
                : listing.availability}
            </span>
            <div className="flex gap-x-2">
              <Button
                className="px-6 py-1 h-8 bg-blue-500 text-white text-sm rounded-3xl hover:bg-blue-600 cursor-pointer"
                onClick={() => router.push(`/listings/${listing.id}`)}
              >
                <Eye />
                View
              </Button>
              <Button
                className="px-6 py-1 h-8 bg-yellow-500 text-white text-sm rounded-3xl hover:bg-yellow-600 cursor-pointer"
                onClick={() => router.push(`/listing?listingId=${listing.id}`)}
              >
                <PenLine />
                Edit
              </Button>
              <Button
                className="px-6 py-1 h-8 bg-red-500 text-white text-sm rounded-3xl hover:bg-red-600 cursor-pointer"
                onClick={() => handleRemoveMember(listing.id!)}
                disabled={
                  deleteMutation.isPending && deletingListingId === listing.id
                }
              >
                <Trash2 />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
