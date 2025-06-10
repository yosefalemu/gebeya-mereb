"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUser } from "@/features/auth/api/get-user";
import { useGetCompanyListings } from "@/features/listings/api/get-company-listing";
import { Eye, FolderOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function CompanyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");

  const {
    data: companyData,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useGetUser(userId!);

  const {
    data: companyListingData,
    isLoading: isCompanyListingLoading,
    isError: isCompanyListingError,
  } = useGetCompanyListings(userId! as string);

  const handleItemClick = (itemId: string) => {
    router.push(`/listings/${itemId}`);
  };

  if (isCompanyLoading || isCompanyListingLoading) {
    return (
      <div className="h-full flex flex-col py-4 gap-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-3">
            <Skeleton className="h-8 w-64" /> {/* Company Name */}
            <Skeleton className="h-4 w-96" /> {/* Bio */}
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-10 w-24" /> {/* Message Button */}
              <Skeleton className="h-10 w-24" /> {/* Call Button */}
            </div>
          </div>
          <Skeleton className="h-44 w-96 rounded-sm" /> {/* Company Image */}
        </div>

        {/* Details Section */}
        <div className="flex items-start justify-between">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-4 w-32" /> {/* Value */}
            </div>
          ))}
        </div>

        {/* About Us, Mission, Products/Services Sections */}
        {["About Us", "Mission", "Products/Services"].map((section, index) => (
          <div key={index} className="flex flex-col gap-y-1">
            <Skeleton className="h-4 w-32" /> {/* Section Title */}
            <Skeleton className="h-24 w-full" /> {/* Section Content */}
          </div>
        ))}

        {/* Products/Services Listings */}
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-32" /> {/* Section Title */}
          <div className="w-full grid grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative bg-gray-100 pb-4 rounded-lg h-52 w-72 col-span-1"
              >
                <Skeleton className="w-full h-32 rounded-lg" />{" "}
                {/* Thumbnail */}
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" /> {/* Name */}
                  <Skeleton className="h-4 w-1/2" /> {/* Rating */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Section */}
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-lg flex flex-col w-52 items-center p-4 gap-y-2">
              <Skeleton className="h-24 w-24 rounded-full" />{" "}
              {/* Team Member Image */}
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompanyError) {
    return <div>Error loading user data.</div>;
  }

  if (isCompanyListingError) {
    return <div>Error loading company listings.</div>;
  }

  if (!companyData || Array.isArray(companyData)) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="h-full flex flex-col py-4 gap-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-3">
          <h1 className="text-2xl font-bold">{companyData.name}</h1>
          <p>{companyData.businessBio}</p>
        </div>
        <div className="relative h-44 w-96 rounded-sm overflow-hidden">
          <Image src={companyData.image!} alt="company-image" fill />
        </div>
      </div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold">Location</h1>
          <p>{companyData.businessLocation}</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold">Industry</h1>
          <p>{companyData.businessIndustry}</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold">Website-link</h1>
          <Link href={`${companyData.businessWebsite}`}>
            {companyData.name}
          </Link>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold">Joined Date</h1>
          <p>{companyData.createdAt}</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold">Rate</h1>
          <p>5</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold">Business Status</h1>
          <p>{companyData.businessStatus}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-1">
        <h1 className="text-lg font-semibold">ABOUT US</h1>
        <p>{companyData.aboutus}</p>
      </div>
      <div className="flex flex-col gap-y-1">
        <h1 className="text-lg font-semibold">MISSION</h1>
        <p>{companyData.mission}</p>
      </div>
      <div className="flex flex-col gap-y-1">
        <h1 className="text-lg font-semibold">PRODUCTS/SERVICES</h1>
        <div>
          {companyListingData?.length === 0 ? (
            <div className="h-[250px] w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-y-2 bg-gray-50 p-6 rounded-full">
                <FolderOpen className="size-24" />
              </div>
            </div>
          ) : (
            <div className="w-full grid grid-cols-4 gap-6">
              {companyListingData?.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-gray-100 pb-4 rounded-lg h-52 w-72 group col-span-1"
                >
                  <Image
                    src={item.thumbnailImage}
                    alt={item.name}
                    fill
                    className="rounded-lg object-cover w-full h-32"
                  />
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-[#001f3e]/50 text-white flex-col items-center justify-center hidden group-hover:flex cursor-pointer rounded-lg"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Eye />
                    <p className="text-sm mt-1 px-2">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-1">
        <h1 className="text-lg font-semibold">TEAM MEMBERS</h1>
        <div className="flex items-center">
          <div className="bg-gray-200 rounded-lg flex flex-col w-52 items-center p-4 gap-y-2">
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              <Image
                src={companyData.image!}
                alt={companyData.name!}
                fill
                className="rounded-t-lg"
              />
            </div>
            <h1 className="text-lg font-semibold">{companyData.name}</h1>
            <p className="text-sm text-gray-500">{companyData.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
