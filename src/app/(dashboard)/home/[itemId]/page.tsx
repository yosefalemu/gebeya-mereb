"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Image from "next/image";
import { Plus } from "lucide-react";
import MemberAvatar from "@/components/member-avatar";

// Mock data for the main item
const items = [
  {
    id: 1,
    title: "Office Space",
    rating: 4,
    totalRatings: 20,
    imageUrl: "/images/workspace.png",
    images: [
      { id: 1, url: "/images/workspace.png" },
      { id: 2, url: "/images/workspace.png" },
      { id: 3, url: "/images/workspace.png" },
      { id: 4, url: "/images/workspace.png" },
      { id: 5, url: "/images/workspace.png" },
      { id: 6, url: "/images/workspace.png" },
      { id: 7, url: "/images/workspace.png" },
      { id: 8, url: "/images/workspace.png" },
    ],
    serviceName: "Private Co-Working Office Space",
    location: "Bole, Addis Ababa",
    category: "Office Spaces",
    subCategory: "Co-Working Spaces",
    description:
      "A fully furnished, quiet, and professional office space for small teams or solo entrepreneurs. Equipped with high-speed WiFi, ergonomic chairs, and meeting rooms. The office is in a prime location with easy access to public transport.",
    price: 1200,
    availability: "Available",
    availabilityDate: "Dec 25, 2025",
    additionalDetails: [
      "High-speed WiFi",
      "Free coffee & snacks",
      "Printing & scanning services",
    ],
    comments: [
      {
        id: 1,
        user: "John Doe",
        comment: "Great space, very convenient!",
        rating: 5,
      },
      {
        id: 2,
        user: "Jane Smith",
        comment: "Loved the amenities and the location.",
        rating: 4,
      },
      {
        id: 3,
        user: "Alice Johnson",
        comment: "Perfect for my team meetings, highly recommend!",
        rating: 5,
      },
    ],
  },
  // Add more items as needed
];

// Mock data for "More Like This" section
const moreLikeThisItems = [
  {
    id: 2,
    title: "Warehouse Space",
    rating: 5,
    totalRatings: 0,
    imageUrl: "/images/workspace.png",
  },
  {
    id: 3,
    title: "Co-Working Hub",
    rating: 4.5,
    totalRatings: 10,
    imageUrl: "/images/workspace.png",
  },
  {
    id: 4,
    title: "Private Office Suite",
    rating: 4.8,
    totalRatings: 15,
    imageUrl: "/images/workspace.png",
  },
  {
    id: 5,
    title: "Shared Office Space",
    rating: 4.2,
    totalRatings: 8,
    imageUrl: "/images/workspace.png",
  },
];

export default function ItemDetails() {
  const { itemId } = useParams();
  const [item, setItem] = useState<(typeof items)[0] | null>(null);

  useEffect(() => {
    if (itemId) {
      const foundItem = items.find(
        (item) => item.id === parseInt(itemId as string)
      );
      setItem(foundItem || null);
    }
  }, [itemId]);
  console.log("ITEM", item);
  console.log("Item id", itemId);

  if (!item) {
    return <div>Loading...</div>;
  }

  // Generate star array based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <div className="w-full flex flex-col gap-y-4 py-4">
      <div className="relative w-full h-56 rounded-xl overflow-hidden">
        <Image
          src="/images/workspace.png"
          fill
          alt="workspaceImage"
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gray-300/60 h-14 rounded-bl-xl rounded-br-xl flex items-center justify-between px-4">
          <div className="flex items-center gap-1">
            {renderStars(item.rating)}
            <span>({`${item.totalRatings} ratings`})</span>
          </div>
          <span className="bg-blue-600 text-white rounded-full px-3 py-1">
            {item.title}
          </span>
        </div>
      </div>
      {/* Image Carousel Section */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="flex">
            {item.images.map((image) => (
              <CarouselItem key={image.id} className="basis-1/4 px-2">
                <Image
                  src={image.url}
                  alt={item.title}
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
        <Button variant="outline" className="uppercase">
          View Company
        </Button>
        <Button variant="outline" className="uppercase">
          Message
        </Button>
        <Button variant="outline" className="uppercase">
          Call
        </Button>
        <Button className="bg-blue-600 text-white uppercase flex items-center justify-center gap-x-2">
          Book now{" "}
          <span className="ml-2">
            <Plus />
          </span>
        </Button>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Listing details</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-1">
            <p>
              <strong>Product/Service Name:</strong> {item.serviceName}
            </p>
            <p>
              <strong>Location:</strong> {item.location}
            </p>
            <p>
              <strong>Category:</strong> {item.category}
            </p>
            <p>
              <strong>Subcategory:</strong> {item.subCategory}
            </p>
            <p>
              <strong>Description:</strong> {item.description}
            </p>
            <p className="mt-4">
              <strong>Price & Availability</strong>
            </p>
            <ul className="list-disc list-inside">
              <li>Price: Negotiable (Starting from Br {item.price}/month)</li>
              <li>
                Availability: {item.availability}, Open Monday–Friday, 8 AM – 6
                PM
              </li>
            </ul>
            <p className="mt-4">
              <strong>Additional Details</strong>
            </p>
            <ul className="list-disc list-inside">
              {item.additionalDetails.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
            <div className="flex items-center justify-between mt-4">
              <h1 className="text-lg font-semibold">Comments and review(10)</h1>
              <div className="flex items-center gap-x-12">
                <div className="flex items-center gap-x-2">
                  {renderStars(4.5)}
                </div>
                <p>4(20 ratings)</p>
              </div>
            </div>
            <div className="flex items-start gap-x-4 mt-4">
              <MemberAvatar name="Abebe" className="size-12" />
              <div className=" bg-blue-200 p-4 rounded-lg">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Animi, voluptatibus nisi enim numquam corporis exercitationem
                  veniam delectus quo cumque accusantium ratione assumenda nam
                  ullam inventore possimus vero officia similique error!
                </p>
                <div className="flex items-center gap-1 justify-end">
                  {renderStars(4.5)}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-x-4 mt-4">
              <MemberAvatar name="Abebe" className="size-12" />
              <div className=" bg-blue-200 p-4 rounded-lg">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Animi, voluptatibus nisi enim numquam corporis exercitationem
                  veniam delectus quo cumque accusantium ratione assumenda nam
                  ullam inventore possimus vero officia similique error!
                </p>
                <div className="flex items-center gap-1 justify-end">
                  {renderStars(4.5)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-y-2 items-start border-l-2 pl-4">
            <div className="flex items-center gap-x-4">
              <p className="bg-green-600 font-semibold text-white px-4 py-2 rounded-sm">
                Available After {item.availabilityDate}
              </p>
              <p className="bg-green-600 font-semibold text-white px-4 py-2 rounded-sm">
                Price: {item.price} ETB per day
              </p>
            </div>
            <h3 className="font-semibold">More Like This</h3>
            <div className="h-80 overflow-y-auto grid grid-cols-2 gap-4 hide-scrollbar border p-4">
              {moreLikeThisItems.map((relatedItem) => (
                <div
                  key={relatedItem.id}
                  className="relative bg-gray-100 pb-4 rounded-lg"
                >
                  <Image
                    src={relatedItem.imageUrl}
                    alt={relatedItem.title}
                    width={170}
                    height={128}
                    className="rounded-tr-lg rounded-tl-lg object-cover w-full h-32"
                  />
                  <p className="text-sm mt-1 px-2">{relatedItem.title}</p>
                  <div className="flex items-center gap-1 px-2">
                    {renderStars(relatedItem.rating)}
                    <span>({relatedItem.totalRatings} ratings)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
