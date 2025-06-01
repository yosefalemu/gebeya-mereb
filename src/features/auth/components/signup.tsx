"use client";
import CustomImageUploader from "@/components/inputs/custom-image-uploader";
import CustomInputLabel from "@/components/inputs/custom-input";
import CustomPasswordInput from "@/components/inputs/custom-password-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignUpComponent() {
  const [currentForm, setCurrentForm] = useState<
    "User Information" | "Business Registration"
  >("User Information");
  const form = useForm({});
  return (
    <div className="flex flex-col justify-between  h-full min-h-screen p-4 bg-[#001f3e] text-white">
      <div className="flex justify-between flex-1 p-16 items-center max-w-7xl mx-auto">
        <div className="flex flex-col items-start w-1/2">
          <div className="h-48 w-[450px] mb-4 relative">
            <Image src="/images/mainLogo.png" alt="main logo" fill />
          </div>
          <p className="text-3xl font-semibold mt-2">
            Connect, Collaborate, Grow
          </p>
          <p className="text-xl text-left mt-2">
            Gebeya Mereb connects vendors and businesses for seamless
            collaboration, efficient transactions, and growth-driven
            partnerships—all in one platform.
          </p>
        </div>
        <div className="w-1/2 flex flex-col gap-y-5 font-semibold">
          <h1 className="text-3xl font">Business Registration</h1>
          <Form {...form}>
            <form
              onSubmit={() => console.log("SUBMOTED")}
              className="flex flex-col gap-y-4"
            >
              {currentForm === "User Information" ? (
                <>
                  <CustomInputLabel
                    nameInSchema="fullName"
                    fieldTitle="Full Name"
                    placeHolder="Enter your full name"
                  />
                  <CustomInputLabel
                    nameInSchema="email"
                    fieldTitle="Email"
                    placeHolder="Enter your email"
                  />
                  <CustomInputLabel
                    nameInSchema="phoneNumber"
                    fieldTitle="Phone Number"
                    placeHolder="Enter your phone number"
                  />
                  <CustomPasswordInput
                    nameInSchema="password"
                    fieldTitle="Password"
                    placeHolder="Enter your password"
                    className="h-12"
                  />
                  <CustomPasswordInput
                    nameInSchema="confirmPassword"
                    fieldTitle="Confirm Password"
                    placeHolder="Confirm your password"
                    className="h-12"
                  />
                </>
              ) : (
                <>
                  <CustomInputLabel
                    nameInSchema="businessLocation"
                    fieldTitle="Business Loacation (City)"
                    placeHolder="Enter your business location"
                  />
                  <CustomInputLabel
                    nameInSchema="businessAddress"
                    fieldTitle="Business Address"
                    placeHolder="Enter your business address"
                  />
                  <CustomInputLabel
                    nameInSchema="businessEmail"
                    fieldTitle="Business Email"
                    placeHolder="Enter your business email"
                  />
                  <CustomInputLabel
                    nameInSchema="businessPhone"
                    fieldTitle="Business Phone"
                    placeHolder="Enter your business phone number"
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
                    onClick={() => console.log("SUBMIT")}
                  >
                    Submit
                  </Button>
                </>
              )}
              <div className="w-full flex items-center gap-x-2">
                <Button
                  className="w-1/2 h-12 cursor-pointer"
                  disabled={currentForm === "User Information"}
                  onClick={() => setCurrentForm("User Information")}
                >
                  Prev
                </Button>
                <Button
                  className="w-1/2 h-12 cursor-pointer"
                  disabled={currentForm === "Business Registration"}
                  onClick={() => setCurrentForm("Business Registration")}
                >
                  Next
                </Button>
              </div>

              <div className="w-full text-sm flex items-center justify-center">
                Have an account?
                <Link href="/sign-in">
                  <span className="ml-2 text-blue-700 underline">Sign In</span>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p>© 2025 Gebeya Mereb. ALL RIGHTS RESERVED.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link href="/privacy-policy" className="hover:underline">
            PRIVACY POLICY
          </Link>
          <Link href="/terms-of-service" className="hover:underline">
            TERMS OF SERVICE
          </Link>
          <Link href="/help-center" className="hover:underline">
            HELP CENTER
          </Link>
        </div>
      </div>
    </div>
  );
}
