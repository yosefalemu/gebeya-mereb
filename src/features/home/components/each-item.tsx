import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming you have a utility for combining Tailwind classes

interface EachItemProps {
  id: string;
  title?: string;
  rating?: number;
  totalRatings?: number;
  imageUrl?: string;
  status?: "PENDING" | "SOLD" | "RESERVED" | "UNAVAILABLE" | "ARCHIVED";
}

export default function EachItem({
  id,
  title,
  imageUrl,
  status,
}: EachItemProps) {
  // Define color mapping for each status
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500",
    SOLD: "bg-red-500",
    RESERVED: "bg-blue-500",
    UNAVAILABLE: "bg-gray-500",
    ARCHIVED: "bg-purple-500",
  };

  const statusColorClass = status ? statusColors[status] : "bg-gray-500";

  return (
    <Link href={`/listings/${id}`}>
      <div className="relative w-[380px] h-[280px] rounded-lg overflow-hidden shadow-lg">
        <Image
          src={imageUrl || "/images/office-space.jpg"}
          alt="Office Space"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold">{title}</h3>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {title?.charAt(0).toUpperCase() || "O"}
          </div>
        </div>
        <div
          className={cn(
            "absolute top-0 right-0 px-2 py-1 text-white text-sm font-medium",
            statusColorClass
          )}
        >
          {status}
        </div>
      </div>
    </Link>
  );
}
