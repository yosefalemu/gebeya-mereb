import { SelectResourceSchemaType } from "@/features/listings/schemas";
import EachItem from "./each-item";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen } from "lucide-react";

export default function ItemLists({
  data,
  isError,
  isLoading,
}: {
  data: SelectResourceSchemaType[];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <Skeleton className="w-full h-40 rounded-t-xl" />{" "}
            {/* Image placeholder */}
            <div className="p-4 flex flex-col gap-y-2">
              <Skeleton className="h-6 w-3/4" /> {/* Title */}
              <Skeleton className="h-4 w-1/2" /> {/* Rating */}
              <Skeleton className="h-4 w-1/3" /> {/* Total ratings */}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error loading items</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-y-2 bg-gray-50 p-6 rounded-full">
          <FolderOpen className="size-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((item) => (
        <div key={item.id ?? Math.random()}>
          <EachItem
            id={item.id !== undefined ? item.id.toString() : ""}
            title={item.name}
            rating={4.5}
            totalRatings={30}
            imageUrl={item.thumbnailImage}
            status={item.availability}
          />
        </div>
      ))}
    </div>
  );
}
