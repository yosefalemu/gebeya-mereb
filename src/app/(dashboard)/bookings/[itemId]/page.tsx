"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useAcceptStatus } from "@/features/listings/api/accept-listing-status";
import { useRejectStatus } from "@/features/listings/api/reject-listing-status";
import { useGetListing } from "@/features/listings/api/get-listing";
import { Skeleton } from "@/components/ui/skeleton";

export default function ItemDetails() {
  const acceptStatusMutation = useAcceptStatus();
  const rejectStatusMutation = useRejectStatus();
  const { itemId } = useParams();
  const { data, isLoading, isError } = useGetListing(itemId as string);

  const [ConfirmDialog, confirm] = useConfirm(
    "Reject Booking",
    "Are you sure you want to reject this booking? This action cannot be undone.",
    {
      variant: "destructive",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
    }
  );

  const AcceptBooking = (listingId: string) => {
    acceptStatusMutation.mutate(
      {
        listingId,
      },
      {
        onSuccess: () => {
          toast.success("Booking accepted successfully!");
        },
        onError: () => {
          toast.error("Failed to accept booking");
        },
      }
    );
  };

  const RejectBooking = async (listingId: string) => {
    const ok = await confirm();
    if (!ok) {
      return;
    }
    rejectStatusMutation.mutate(
      {
        listingId,
      },
      {
        onSuccess: () => {
          toast.success("Booking rejected successfully!");
        },
        onError: () => {
          toast.error("Failed to reject booking");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-y-4 py-4">
        <div className="relative w-full h-56 rounded-xl overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="relative">
          <Skeleton className="w-full h-48" />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="col-span-1">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-8 w-1/2 mb-4 mt-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="flex items-start gap-x-4 mt-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="h-20 w-3/4" />
              </div>
              <div className="flex items-start gap-x-4 mt-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="h-20 w-3/4" />
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-y-2 items-start border-l-2 pl-4">
              <Skeleton className="h-8 w-full mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-52 w-64" />
                <Skeleton className="h-52 w-64" />
                <Skeleton className="h-52 w-64" />
                <Skeleton className="h-52 w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isError) {
    return <div>Error loading item details</div>;
  }

  return (
    <div className="w-full flex flex-col gap-y-4 py-4">
      <ConfirmDialog />
      <div className="relative w-full h-56 rounded-xl overflow-hidden">
        <Image
          src={data?.data.thumbnailImage || "/images/workspace.png"}
          fill
          alt="workspaceImage"
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gray-300/60 h-14 rounded-bl-xl rounded-br-xl flex items-center justify-between px-4">
          <span className="bg-blue-600 text-white rounded-full px-3 py-1">
            {data?.data.name}
          </span>
        </div>
      </div>
      {/* Image Carousel Section */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="flex">
            {data?.data.otherImages.map((image, index) => (
              <CarouselItem key={index} className="basis-1/4 px-2">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-48"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 bottom-4" />
          <CarouselNext className="absolute right-4 bottom-4" />
        </Carousel>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <Button
          className="uppercase cursor-pointer"
          variant="default"
          onClick={() => {
            if (data?.data.id) {
              AcceptBooking(data.data.id);
            }
          }}
          disabled={acceptStatusMutation.isPending}
        >
          Approve
        </Button>
        <Button
          className="uppercase cursor-pointer"
          variant="destructive"
          onClick={() => {
            if (data?.data.id) {
              RejectBooking(data.data.id);
            }
          }}
          disabled={rejectStatusMutation.isPending}
        >
          Decline
        </Button>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-1">
            <h2 className="font-semibold uppercase text-2xl">
              Listing details
            </h2>
            <p>
              <strong>Product/Service Name:</strong> {data?.data.name}
            </p>
            <p>
              <strong>Location:</strong> {data?.data.location}
            </p>
            <p>
              <strong>Address:</strong> {data?.data.address}
            </p>
            <p>
              <strong>Category:</strong> {data?.data.category}
            </p>
            <p>
              <strong>Description:</strong> {data?.data.description}
            </p>
            <p>
              <strong>Preferred Contact Method:</strong>{" "}
              {data?.data.preferredContactMethod}
            </p>
          </div>
          <div className="col-span-1">
            <h2 className="font-semibold uppercase text-2xl">
              Price & Availability
            </h2>
            <p>
              <strong>Negoitable:</strong>{" "}
              {data?.data.negoitable ? "Yes" : "No"}
            </p>
            <p>
              <strong>Price:</strong> {data?.data.price}
            </p>
            <p>
              <strong>Currency:</strong> {data?.data.currency}
            </p>
            <p>
              <strong>Rate:</strong> {data?.data.rate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
