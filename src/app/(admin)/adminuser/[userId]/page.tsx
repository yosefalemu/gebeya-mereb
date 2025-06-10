"use client";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useGetUser } from "@/features/auth/api/get-user";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useAcceptUser } from "@/features/auth/api/accept-user-status";
import { useRejectUser } from "@/features/auth/api/reject-user";
import { FolderOpen } from "lucide-react";

export default function AdminUserView() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const userAcceptMutation = useAcceptUser();
  const userRejectMutation = useRejectUser();
  const {
    data: currentUserData,
    isError,
    error,
    isLoading,
  } = useGetUser(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Show loading skeleton during initial load or refetch
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
          <div className="h-12 w-40 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex flex-col lg:flex-row gap-y-8 gap-x-4 w-full">
          {/* User Information Skeleton */}
          <div className="flex flex-col gap-y-4 w-full lg:w-1/2 p-6 rounded-lg shadow-md">
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col gap-y-2">
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                {index === 3 ? (
                  <div className="w-[300px] h-[400px] bg-gray-100 rounded-md animate-pulse" />
                ) : (
                  <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
                )}
              </div>
            ))}
          </div>
          {/* Business Information Skeleton */}
          <div className="flex flex-col gap-y-4 w-full lg:w-1/2 p-6 rounded-lg shadow-md">
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex flex-col gap-y-2">
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
            {/* Business License Skeleton */}
            <div className="flex flex-col gap-y-4 bg-gray-100 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="w-[300px] h-[400px] bg-gray-100 rounded-md animate-pulse" />
            </div>
            {/* Authorization Letter Skeleton */}
            <div className="flex flex-col gap-y-4 bg-gray-100 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="w-[300px] h-[400px] bg-gray-100 rounded-md animate-pulse" />
            </div>
            {/* Buttons Skeleton */}
            <div className="flex gap-x-2">
              <div className="h-10 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-10 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    toast.error(error?.message || "Failed to load user data");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-900">
        <h1 className="text-2xl font-bold mb-4">Error Loading User</h1>
        <p className="text-red-500">{error?.message || "An error occurred"}</p>
        <Button
          className="mt-4 w-40 h-12"
          onClick={() => router.push("/admin/users")}
        >
          Back to Users
        </Button>
      </div>
    );
  }

  // Handle no-data state (invalid or missing user)
  if (
    !currentUserData ||
    Array.isArray(currentUserData) ||
    !currentUserData.id
  ) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-y-2 bg-gray-400 p-6 rounded-full text-white">
          <FolderOpen className="size-24" />
          <p className="text-lg">No User Found</p>
        </div>
      </div>
    );
  }

  // Approve/reject actions
  const handleApprove = () => {
    userAcceptMutation.mutate(
      { userId: currentUserData.id },
      {
        onSuccess: () => {
          toast.success("User approved successfully");
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to approve user");
        },
      }
    );
  };

  const handleReject = () => {
    userRejectMutation.mutate(
      { userId: currentUserData.id },
      {
        onSuccess: () => {
          toast.success("User rejected successfully");
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to reject user");
        },
      }
    );
  };

  // Zoom controls
  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setZoomLevel(1);
    setIsModalOpen(true);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setZoomLevel(1);
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      {/* Modal for zoomed image */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-gray-400 p-4 rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Document Preview</h2>
              <Button className="w-10 h-10 p-0" onClick={handleCloseModal}>
                ✕
              </Button>
            </div>
            <div className="flex justify-center overflow-auto max-h-[80vh]">
              <Image
                src={selectedImage}
                alt="Document Preview"
                width={600}
                height={600}
                className="object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
            <div className="flex justify-center gap-x-4 mt-4">
              <Button
                className="w-24 h-10 bg-blue-600 hover:bg-blue-700"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
              >
                Zoom In
              </Button>
              <Button
                className="w-24 h-10 bg-blue-600 hover:bg-blue-700"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
              >
                Zoom Out
              </Button>
              <Button
                className="w-24 h-10 bg-blue-600 hover:bg-blue-700"
                onClick={handleResetZoom}
                disabled={zoomLevel === 1}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-y-8 gap-x-4 w-full">
        {/* User Information */}
        <div className="flex flex-col gap-y-4 w-full lg:w-1/2 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">User Information</h2>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Full Name</p>
            <p className="text-lg">{currentUserData.name || "N/A"}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-lg">{currentUserData.email || "N/A"}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Phone Number</p>
            <p className="text-lg">{currentUserData.phoneNumber || "N/A"}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">User Image</p>
            {currentUserData.image ? (
              <Image
                src={currentUserData.image}
                alt="User Image"
                width={300}
                height={300}
                className="rounded-md object-contain max-w-full h-auto"
              />
            ) : (
              <p className="text-lg text-gray-500">No image provided</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Business Industry</p>
            <p className="text-lg">
              {currentUserData.businessIndustry || "N/A"}
            </p>
          </div>
        </div>

        {/* Business Information */}
        <div className="flex flex-col gap-y-4 w-full lg:w-1/2 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Business Information</h2>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Business Location (City)</p>
            <p className="text-lg">
              {currentUserData.businessLocation || "N/A"}
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Business Address</p>
            <p className="text-lg">
              {currentUserData.businessAddress || "N/A"}
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Business Email</p>
            <p className="text-lg">{currentUserData.businessEmail || "N/A"}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Business Phone</p>
            <p className="text-lg">{currentUserData.businessPhone || "N/A"}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Business Bio</p>
            <p className="text-lg">{currentUserData.businessBio || "N/A"}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Business Website</p>
            <p className="text-lg">
              {currentUserData.businessWebsite || "N/A"}
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">Mission</p>
            <p className="text-lg">{currentUserData.mission || "N/A"}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-gray-400">About Us</p>
            <p className="text-lg">{currentUserData.aboutus || "N/A"}</p>
          </div>
          <div className="flex flex-col gap-y-4 border p-4 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Business License</p>
              {currentUserData.businessStatus === "PENDING" && (
                <span className="text-sm text-yellow-400 bg-yellow-900 px-2 py-1 rounded">
                  Pending Review
                </span>
              )}
            </div>
            {currentUserData.businessLicense ? (
              <Image
                src={currentUserData.businessLicense}
                alt="Business License"
                width={300}
                height={300}
                className="rounded-md object-contain max-w-full h-auto border-2 border-yellow-600 cursor-pointer"
                onClick={() =>
                  handleImageClick(currentUserData.businessLicense!)
                }
              />
            ) : (
              <p className="text-lg text-gray-500">No license provided</p>
            )}
          </div>
          <div className="flex flex-col gap-y-4 border p-4 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Authorization Letter</p>
              {currentUserData.businessStatus === "PENDING" && (
                <span className="text-sm text-yellow-400 bg-yellow-900 px-2 py-1 rounded">
                  Pending Review
                </span>
              )}
            </div>
            {currentUserData.authorizationLetter ? (
              <Image
                src={currentUserData.authorizationLetter}
                alt="Authorization Letter"
                width={300}
                height={300}
                className="rounded-md object-contain max-w-full h-auto border-2 border-yellow-600 cursor-pointer"
                onClick={() =>
                  handleImageClick(currentUserData.authorizationLetter!)
                }
              />
            ) : (
              <p className="text-lg text-gray-500">No letter provided</p>
            )}
          </div>
          <div className="flex gap-x-2">
            <Button
              className="w-24 h-10 bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={
                userAcceptMutation.isPending || userRejectMutation.isPending
              }
            >
              Approve
            </Button>
            <Button
              className="w-24 h-10 bg-red-600 hover:bg-red-700"
              onClick={handleReject}
              disabled={
                userAcceptMutation.isPending || userRejectMutation.isPending
              }
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
