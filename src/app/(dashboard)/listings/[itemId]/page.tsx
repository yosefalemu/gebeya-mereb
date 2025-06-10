"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Eye, FolderOpen, Plus } from "lucide-react";
import { useGetListing } from "@/features/listings/api/get-listing";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateBooking } from "@/features/booking/api/create-booking";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

export default function ItemDetails() {
  const router = useRouter();
  const createBookingMutation = useCreateBooking();
  const { itemId } = useParams();
  const { data, isLoading, isError } = useGetListing(itemId as string);

  const [ConfirmDialog, confirm] = useConfirm(
    "Book Resource",
    "Are you sure you want to book this resource? This action cannot be undone.",
    {
      variant: "destructive",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
    }
  );

  const handleBooking = async (listingId: string) => {
    const ok = await confirm();
    if (!ok) {
      return;
    }

    createBookingMutation.mutate(
      {
        json: { listingId },
      },
      {
        onSuccess: () => {
          toast.success("Item booked successfully!");
        },
        onError: () => {
          toast.error("Failed to book item. Please try again.");
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

  // Handle navigation to a different listing
  const handleItemClick = (relatedItemId: string) => {
    if (relatedItemId !== itemId) {
      router.push(`/listings/${relatedItemId}`);
    } else {
      console.log("Same ID, no navigation needed:", relatedItemId);
    }
  };

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
          variant="outline"
          className="uppercase cursor-pointer"
          onClick={() => router.push(`/company?userId=${data?.data.userId}`)}
        >
          View Company
        </Button>
        <Button
          className="bg-blue-600 text-white uppercase flex items-center justify-center gap-x-2 cursor-pointer"
          onClick={() => {
            if (data?.data.id) {
              handleBooking(data.data.id);
            }
          }}
          disabled={
            !data?.data.id ||
            createBookingMutation.isPending ||
            data?.data.availability !== "PENDING"
          }
        >
          Book now
          <span className="ml-2">
            <Plus />
          </span>
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
            <p>
              <strong>Negoitable:</strong>{" "}
              {data?.data.negoitable ? "Yes" : "No"}
            </p>
            <h2 className="font-semibold uppercase text-2xl mt-4">
              Price & Availability
            </h2>
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
          <div className="col-span-1 flex flex-col gap-y-2 items-start border-l-2 pl-4">
            <h2 className="font-semibold uppercase text-2xl">Similar Items</h2>
            {data?.relatedListings.length === 0 ? (
              <div className="h-[250px] w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-y-2 bg-gray-50 p-6 rounded-full">
                  <FolderOpen className="size-24" />
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-6">
                {data?.relatedListings.map((relatedItem) => (
                  <div
                    key={relatedItem.id}
                    className="relative bg-gray-100 pb-4 rounded-lg h-52 w-72 group col-span-1"
                  >
                    <Image
                      src={relatedItem.thumbnailImage}
                      alt={relatedItem.name}
                      fill
                      className="rounded-lg object-cover w-full h-32"
                    />
                    <div
                      className="absolute top-0 left-0 w-full h-full bg-[#001f3e]/50 text-white flex-col items-center justify-center hidden group-hover:flex cursor-pointer rounded-lg"
                      onClick={() => handleItemClick(relatedItem.id)}
                    >
                      <Eye />
                      <p className="text-sm mt-1 px-2">{relatedItem.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
