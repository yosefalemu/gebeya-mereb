import { Button } from "@/components/ui/button";
import { Eye, PenLine, Trash2 } from "lucide-react";
import Image from "next/image";

type ListingStatus = "Active" | "Sold" | "Reserved" | "Pending" | "Archived";

interface Listing {
  id: number;
  title: string;
  category: string;
  price: number;
  currency: string;
  status: ListingStatus;
  datePosted: string;
  views: number;
  image?: string; // Optional image property
}

export default function MyListingsItems() {
  const myListings: Listing[] = [
    {
      id: 1,
      title: "Office Space",
      category: "Office Spaces",
      price: 100,
      currency: "ETB",
      status: "Active",
      datePosted: "20 Mar 2023",
      views: 120,
      image: "/images/workspace.png",
    },
    {
      id: 2,
      title: "Listing 2",
      category: "Furniture",
      price: 200,
      currency: "USD",
      status: "Sold",
      datePosted: "15 Apr 2023",
      views: 85,
      image: "/images/workspace.png",
    },
    {
      id: 3,
      title: "Listing 3",
      category: "Clothing",
      price: 50,
      currency: "EUR",
      status: "Reserved",
      datePosted: "10 May 2023",
      views: 45,
      image: "/images/workspace.png",
    },
    {
      id: 4,
      title: "Listing 4",
      category: "Books",
      price: 15,
      currency: "GBP",
      status: "Pending",
      datePosted: "05 Jun 2023",
      views: 30,
      image: "/images/workspace.png",
    },
    {
      id: 5,
      title: "Listing 5",
      category: "Toys",
      price: 30,
      currency: "JPY",
      status: "Archived",
      datePosted: "01 Jul 2023",
      views: 10,
      image: "/images/workspace.png",
    },
  ];

  const statusColors: Record<ListingStatus, string> = {
    Active: "bg-green-100 text-green-800",
    Sold: "bg-red-100 text-red-800",
    Reserved: "bg-yellow-100 text-yellow-800",
    Pending: "bg-blue-100 text-blue-800",
    Archived: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="flex flex-col gap-y-3">
      {myListings.map((listing) => (
        <div
          key={listing.id}
          className="flex items-center gap-x-4 bg-white rounded-xl shadow-sm border border-gray-200 h-40"
        >
          <div className="w-64 h-40 rounded relative">
            <Image
              src={listing.image ?? "/images/workspace.png"}
              fill
              alt={listing.title}
              className="rounded-xl object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{listing.title}</h3>
            <p className="text-sm text-gray-600">
              Category: {listing.category}
            </p>
            <p className="text-sm text-gray-600">
              Price: {listing.currency} {listing.price} per day
            </p>
            <p className="text-sm text-gray-600">
              Date Posted: {listing.datePosted}
            </p>
            <p className="text-sm text-gray-600">Views: {listing.views}</p>
          </div>
          <div className="flex space-x-2 h-full flex-col justify-between items-end p-2">
            <span
              className={`px-6 py-1 text-xs font-medium rounded-full flex items-center justify-center w-fit ${
                statusColors[listing.status]
              }`}
            >
              {listing.status}
            </span>
            <div className="flex gap-x-2">
              <Button className="px-6 py-1 h-8 bg-blue-500 text-white text-sm rounded-3xl hover:bg-blue-600 cursor-pointer">
                <Eye />
                View
              </Button>
              <Button className="px-6 py-1 h-8 bg-yellow-500 text-white text-sm rounded-3xl hover:bg-yellow-600 cursor-pointer">
                <PenLine />
                Edit
              </Button>
              <Button className="px-6 py-1 h-8 bg-red-500 text-white text-sm rounded-3xl hover:bg-red-600 cursor-pointer">
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
