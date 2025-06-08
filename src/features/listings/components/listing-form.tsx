/* eslint-disable react/jsx-no-comment-textnodes */
"use client";
import CustomCheckboxInput from "@/components/inputs/custom-checkbox-input";
import CustomImageUploader from "@/components/inputs/custom-image-uploader";
import CustomInputLabel from "@/components/inputs/custom-input";
import CustomSelectInput from "@/components/inputs/custom-select-input";
import CustomTextareaLabel from "@/components/inputs/custom-textarea";
import CustomMultipleImageUploader from "@/components/inputs/multiple-image-uploader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertResourceSchema, InsertResourceSchemaType } from "../schemas";
import { useCreateListing } from "../api/create-listing";
import { useEditListing } from "../api/edit-listing";
import { useGetListing } from "../api/get-listing";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function NewListing() {
  const listingId = useSearchParams().get("listingId") || "";
  const createListingMutation = useCreateListing();
  const editListingMutation = useEditListing();
  const router = useRouter();
  const { data: listingData, isLoading: isListingLoading } = useGetListing(
    listingId as string
  );

  const form = useForm<InsertResourceSchemaType>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    resolver: zodResolver(insertResourceSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnailImage: "",
      otherImages: [""],
      category: "OTHER",
      price: "",
      currency: "ETB",
      rate: "DAILY",
      availability: "PENDING",
      negoitable: false,
      location: "ADDIS_ABABA",
      address: "",
      termsAndConditions: false,
      preferredContactMethod: "EMAIL",
    },
  });

  useEffect(() => {
    if (listingId && listingData?.data && !isListingLoading) {
      form.reset({
        name: listingData.data.name || "",
        description: listingData.data.description || "",
        thumbnailImage: listingData.data.thumbnailImage || "",
        otherImages:
          listingData.data.otherImages.length > 0
            ? listingData.data.otherImages
            : [""],
        category: listingData.data.category || "OTHER",
        price: listingData.data.price || "",
        currency: listingData.data.currency || "ETB",
        rate: listingData.data.rate || "DAILY",
        availability: listingData.data.availability || "PENDING",
        negoitable: listingData.data.negoitable || false,
        location: listingData.data.location || "ADDIS_ABABA",
        address: listingData.data.address || "",
        termsAndConditions: listingData.data.termsAndConditions ?? false,
        preferredContactMethod:
          listingData.data.preferredContactMethod || "EMAIL",
        userId: listingData.data.userId ?? null,
      });
    }
  }, [listingId, listingData, isListingLoading, form]);

  const listingCategories = [
    { id: "1", name: "TECHNOLOGY" },
    { id: "2", name: "BUSINESS" },
    { id: "3", name: "EDUCATION" },
    { id: "4", name: "HEALTH" },
    { id: "5", name: "FINANCE" },
    { id: "6", name: "LIFESTYLE" },
    { id: "7", name: "OTHER" },
  ];

  const availabilityType = [
    { id: "1", name: "PENDING" },
    { id: "2", name: "SOLD" },
    { id: "3", name: "RESERVED" },
    { id: "4", name: "UNAVAILABLE" },
    { id: "5", name: "ARCHIVED" },
  ];

  const currencyOptions = [
    { id: "1", name: "ETB" },
    { id: "2", name: "USD" },
    { id: "3", name: "EUR" },
  ];

  const rateOptions = [
    { id: "1", name: "HOURLY" },
    { id: "2", name: "DAILY" },
    { id: "3", name: "WEEKLY" },
    { id: "4", name: "MONTHLY" },
  ];

  const locationOptions = [
    { id: "1", name: "ADDIS_ABABA" },
    { id: "2", name: "DIRE_DAW" },
    { id: "3", name: "HOSANA" },
    { id: "4", name: "BAHIR_DAR" },
    { id: "5", name: "GONDAR" },
    { id: "6", name: "DESSIE" },
    { id: "7", name: "JIMMA" },
    { id: "8", name: "ARBA_MINCH" },
    { id: "9", name: "MEKELLE" },
    { id: "10", name: "OTHER" },
  ];

  const preferredContactMethodOptions = [
    { id: "1", name: "EMAIL" },
    { id: "2", name: "PHONE" },
    { id: "3", name: "WHATSAPP" },
    { id: "4", name: "SMS" },
    { id: "5", name: "IN_PERSON" },
  ];

  const handleFormSubmit = (data: InsertResourceSchemaType) => {
    if (data.termsAndConditions === false) {
      toast.error("You must agree to the terms and conditions");
      return;
    }
    console.log("Form data submitted:", data);

    if (listingId) {
      editListingMutation.mutate(
        {
          listingId: listingId as string,
          json: data,
        },
        {
          onSuccess: () => {
            toast.success("Listing updated successfully!");
            router.push("/my-listings");
          },
          onError: (error) => {
            toast.error(error.message || "Update listing failed");
          },
        }
      );
    } else {
      createListingMutation.mutate(
        { json: data },
        {
          onSuccess: () => {
            toast.success("Resource created successfully!");
            form.reset();
            router.push("/my-listings");
          },
          onError: (error) => {
            toast.error(error.message || "Create resource failed");
          },
        }
      );
    }
  };

  if (isListingLoading) {
    return (
      <div className="flex flex-col gap-y-5 font-semibold">
        <Skeleton className="h-8 w-64" /> {/* Title */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-start col-span-1 gap-4">
            <Skeleton className="h-10 w-full" /> {/* Post Title */}
            <Skeleton className="h-10 w-full" /> {/* Category */}
            <Skeleton className="h-40 w-full" /> {/* Description */}
            <Skeleton className="h-10 w-full" /> {/* Availability */}
            <div className="flex items-center w-full gap-x-3">
              <Skeleton className="h-10 w-1/2" /> {/* Price */}
              <Skeleton className="h-10 w-44" /> {/* Currency */}
              <Skeleton className="h-10 w-48" /> {/* Rate */}
            </div>
          </div>
          <div className="flex flex-col items-start col-span-1 gap-4">
            <div className="flex items-center w-full justify-between">
              <Skeleton className="h-10 w-72" /> {/* Location */}
              <Skeleton className="h-10 w-72" /> {/* Address */}
            </div>
            <Skeleton className="h-10 w-full" />{" "}
            {/* Preferred Contact Method */}
            <Skeleton className="h-32 w-full" /> {/* Thumbnail Image */}
            <Skeleton className="h-32 w-full" /> {/* Other Images */}
            <Skeleton className="h-6 w-40" /> {/* Negoitable Checkbox */}
            <Skeleton className="h-6 w-64" /> {/* Terms Checkbox */}
            <Skeleton className="h-12 w-full" /> {/* Button */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-5 font-semibold">
      <h1 className="text-2xl font-semibold">
        {listingId ? "Edit Listing" : "Create New Listing"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-start col-span-1 gap-4">
              <CustomInputLabel
                fieldTitle="Post Title"
                nameInSchema="name"
                placeHolder="Enter post title"
                maxCharLength={50}
                className="w-full"
              />
              <CustomSelectInput
                data={listingCategories}
                fieldTitle="Category"
                nameInSchema="category"
                placeHolder="Select category"
                className=""
              />
              <CustomTextareaLabel
                fieldTitle="Description"
                nameInSchema="description"
                placeHolder="Enter your description"
                rows={20}
                maxCharLength={500}
                className="w-full"
              />
              <CustomSelectInput
                data={availabilityType}
                fieldTitle="Availability"
                nameInSchema="availability"
                placeHolder="Select availability"
                className="w-full"
              />
              <div className="flex items-center w-full gap-x-3">
                <CustomInputLabel
                  fieldTitle="Price/Rate"
                  nameInSchema="price"
                  placeHolder="Enter price"
                  className="max-w-lg"
                />
                <CustomSelectInput
                  fieldTitle="Currency"
                  nameInSchema="currency"
                  placeHolder="ETB"
                  data={currencyOptions}
                  className="w-44"
                />
                <CustomSelectInput
                  fieldTitle="Rate"
                  nameInSchema="rate"
                  placeHolder="Select Rate"
                  data={rateOptions}
                  className="w-48"
                />
              </div>
            </div>
            <div className="flex flex-col items-start col-span-1 gap-4">
              <div className="flex items-center w-full justify-between">
                <CustomSelectInput
                  fieldTitle="Location"
                  nameInSchema="location"
                  placeHolder="Select your location"
                  data={locationOptions}
                  className="w-72"
                />
                <CustomInputLabel
                  fieldTitle="Address"
                  nameInSchema="address"
                  placeHolder="Enter your address"
                  className="w-72"
                />
              </div>
              <CustomSelectInput
                fieldTitle="Preferred Contact Method"
                nameInSchema="preferredContactMethod"
                placeHolder="Select contact method"
                data={preferredContactMethodOptions}
              />
              <CustomImageUploader
                fieldTitle="Thumbnail Image"
                nameInSchema="thumbnailImage"
              />
              <CustomMultipleImageUploader
                fieldTitle="upload other images"
                nameInSchema="otherImages"
                maxFiles={100}
                placeHolder="Upload images"
                editMode={!!listingId}
                listing={listingData?.data}
                clearImages={() => form.setValue("otherImages", [])}
              />
              <CustomCheckboxInput
                fieldTitle="Negoitable"
                nameInSchema="negoitable"
                className="flex-row-reverse"
              />
              <CustomCheckboxInput
                fieldTitle="I agree to the terms and conditions"
                nameInSchema="termsAndConditions"
                className="flex-row-reverse"
              />
              <Button
                className="h-12 w-full cursor-pointer"
                disabled={
                  createListingMutation.isPending ||
                  editListingMutation.isPending
                }
              >
                {listingId
                  ? editListingMutation.isPending
                    ? "Updating..."
                    : "Update"
                  : createListingMutation.isPending
                  ? "Creating..."
                  : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
