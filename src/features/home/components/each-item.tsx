import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

interface EachItemProps {
  id: string;
  title?: string;
  rating?: number;
  totalRatings?: number;
  imageUrl?: string;
}
export default function EachItem({
  id,
  title,
  rating,
  totalRatings,
  imageUrl,
}: EachItemProps) {
  return (
    <Link href={`/home/${id}`}>
      <div className="relative w-[360px] h-[280px] rounded-lg overflow-hidden shadow-lg">
        <Image
          src={imageUrl || "/images/office-space.jpg"}
          alt="Office Space"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold">{title}</h3>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold ml-1">
                {rating}
              </span>
              <span className="text-white ml-2 opacity-75">{`(${totalRatings} ratings)`}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
        </div>
      </div>
    </Link>
  );
}
