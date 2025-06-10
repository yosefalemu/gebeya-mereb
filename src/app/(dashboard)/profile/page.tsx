"use client";
import CustomImageUploader from "@/components/inputs/custom-image-uploader";
import CustomInputLabel from "@/components/inputs/custom-input";
import CustomPasswordInput from "@/components/inputs/custom-password-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/api/current-user";
import { useUpdateUser } from "@/features/auth/api/update-user";
import {
  updateUserSchema,
  updateUserSchemaType,
} from "@/features/auth/schemas";
import CustomTextareaLabel from "@/components/inputs/custom-textarea";
import { useEffect } from "react";

export default function ProfileUpdateComponent() {
  const updateMutation = useUpdateUser();
  const router = useRouter();
  const { data: currentUserData } = useCurrentUser();

  // Initialize form with current user data
  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name:
        !Array.isArray(currentUserData) && currentUserData?.name
          ? currentUserData.name
          : "",
      email:
        !Array.isArray(currentUserData) && currentUserData?.email
          ? currentUserData.email
          : "",
      image: !Array.isArray(currentUserData)
        ? currentUserData?.image || undefined
        : undefined,
      phoneNumber:
        !Array.isArray(currentUserData) && currentUserData?.phoneNumber
          ? currentUserData.phoneNumber
          : "",
      password: "", // Password fields are empty for updates (optional)
      confirmPassword: "",
      businessLocation:
        !Array.isArray(currentUserData) && currentUserData?.businessLocation
          ? currentUserData.businessLocation
          : "",
      businessEmail:
        !Array.isArray(currentUserData) && currentUserData?.businessEmail
          ? currentUserData.businessEmail
          : "",
      businessPhone:
        !Array.isArray(currentUserData) && currentUserData?.businessPhone
          ? currentUserData.businessPhone
          : "",
      businessBio:
        !Array.isArray(currentUserData) && currentUserData?.businessBio
          ? currentUserData.businessBio
          : "",
      businessWebsite:
        !Array.isArray(currentUserData) && currentUserData?.businessWebsite
          ? currentUserData.businessWebsite
          : "",
      businessLicense: !Array.isArray(currentUserData)
        ? currentUserData?.businessLicense || undefined
        : undefined,
      authorizationLetter: !Array.isArray(currentUserData)
        ? currentUserData?.authorizationLetter || undefined
        : undefined,
      businessIndustry:
        !Array.isArray(currentUserData) && currentUserData?.businessIndustry
          ? currentUserData.businessIndustry
          : "",
      businessAddress:
        !Array.isArray(currentUserData) && currentUserData?.businessAddress
          ? currentUserData.businessAddress
          : "",
      mission:
        !Array.isArray(currentUserData) && currentUserData?.mission
          ? currentUserData.mission
          : "",
      aboutus:
        !Array.isArray(currentUserData) && currentUserData?.aboutus
          ? currentUserData.aboutus
          : "",
    },
  });

  useEffect(() => {
    if (currentUserData) {
      if (currentUserData && !Array.isArray(currentUserData)) {
        form.reset({
          name: currentUserData.name || "",
          email: currentUserData.email || "",
          image: currentUserData.image || undefined,
          phoneNumber: currentUserData.phoneNumber || "",
          password: "",
          confirmPassword: "",
          businessLocation: currentUserData.businessLocation || "",
          businessEmail: currentUserData.businessEmail || "",
          businessPhone: currentUserData.businessPhone || "",
          businessBio: currentUserData.businessBio || "",
          businessWebsite: currentUserData.businessWebsite || "",
          businessLicense: currentUserData.businessLicense || undefined,
          authorizationLetter: currentUserData.authorizationLetter || undefined,
          businessIndustry: currentUserData.businessIndustry || "",
          businessAddress: currentUserData.businessAddress || "",
          mission: currentUserData.mission || "",
          aboutus: currentUserData.aboutus || "",
        });
      }
    }
  }, [currentUserData, form]);
  console.log("FORM VALUE", form.getValues());
  console.log("CURRENT USER DATA", currentUserData);
  const handleUpdate = (data: updateUserSchemaType) => {
    if (data.password || data.confirmPassword) {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    if (!Array.isArray(currentUserData) && currentUserData?.id) {
      updateMutation.mutate(
        {
          id: currentUserData.id,
          json: data,
          param: { userId: currentUserData.id },
        },
        {
          onSuccess: () => {
            toast.success("Profile updated successfully!");
            router.push("/profile");
          },
          onError: () => {
            toast.error(
              updateMutation.error
                ? updateMutation.error.message
                : "Profile update failed"
            );
          },
        }
      );
    } else {
      toast.error("User data is invalid or missing.");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-screen p-4 text-white">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdate)}
          className="flex flex-col lg:flex-row gap-y-4 w-full gap-x-4"
        >
          <div className="flex flex-col gap-y-4 w-full lg:w-1/2">
            <h1 className="text-3xl font">User Information</h1>
            <CustomInputLabel
              nameInSchema="name"
              fieldTitle="Full Name"
              placeHolder="Enter your full name"
              className="text-black"
            />
            <CustomInputLabel
              nameInSchema="email"
              fieldTitle="Email"
              placeHolder="Enter your email"
              className="text-black"
            />
            <CustomInputLabel
              nameInSchema="phoneNumber"
              fieldTitle="Phone Number"
              placeHolder="Enter your phone number"
              className="text-black"
            />
            <CustomPasswordInput
              nameInSchema="password"
              fieldTitle="Password"
              placeHolder="Enter new password (optional)"
              className="h-12"
            />
            <CustomPasswordInput
              nameInSchema="confirmPassword"
              fieldTitle="Confirm Password"
              placeHolder="Confirm new password (optional)"
              className="h-12"
            />
            <CustomImageUploader
              nameInSchema="image"
              fieldTitle="User Image"
              isPending={false}
            />
            <CustomInputLabel
              nameInSchema="businessIndustry"
              fieldTitle="Business Industry"
              placeHolder="Enter business industry"
              className="text-black"
            />
          </div>
          <div className="flex flex-col gap-y-4 w-full lg:w-1/2">
            <h1 className="text-3xl font">Business Information</h1>
            <CustomInputLabel
              nameInSchema="businessLocation"
              fieldTitle="Business Location (City)"
              placeHolder="Enter your business location"
              className="text-black"
            />
            <CustomInputLabel
              nameInSchema="businessAddress"
              fieldTitle="Business Address"
              placeHolder="Enter your business address"
              className="text-black"
            />
            <CustomInputLabel
              nameInSchema="businessEmail"
              fieldTitle="Business Email"
              placeHolder="Enter your business email"
              className="text-black"
            />
            <CustomInputLabel
              nameInSchema="businessPhone"
              fieldTitle="Business Phone"
              placeHolder="Enter your business phone number"
              className="text-black"
            />
            <CustomInputLabel
              nameInSchema="businessBio"
              fieldTitle="Business Bio"
              placeHolder="Enter a brief description of your business"
              className="text-black"
            />
            <CustomTextareaLabel
              nameInSchema="mission"
              fieldTitle="Mission"
              placeHolder="Enter your mission"
              maxCharLength={500}
              className="text-black"
            />
            <CustomTextareaLabel
              nameInSchema="aboutus"
              fieldTitle="About Us"
              placeHolder="Enter about us information"
              maxCharLength={500}
              className="text-black"
            />
            <CustomInputLabel
              nameInSchema="businessWebsite"
              fieldTitle="Business Website"
              placeHolder="Enter business website"
              className="text-black"
            />
            <div className="flex items-center gap-x-3">
              <CustomImageUploader
                nameInSchema="businessLicense"
                fieldTitle="Business License"
                isPending={false}
              />
              <CustomImageUploader
                nameInSchema="authorizationLetter"
                fieldTitle="Authorization Letter"
                isPending={false}
              />
            </div>
            <Button
              className="w-full h-12 cursor-pointer"
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
