"use client";
import CustomImageUploader from "@/components/inputs/custom-image-uploader";
import CustomInputLabel from "@/components/inputs/custom-input";
import CustomPasswordInput from "@/components/inputs/custom-password-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRegister } from "../api/register-user";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchemaType, insertUserSchema } from "../schemas";
import { useRouter } from "next/navigation";

export default function SignUpComponent() {
  const registerMutation = useRegister();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      image: undefined,
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      businessLocation: "",
      businessEmail: "",
      businessPhone: "",
      businessBio: "",
      businessWebsite: "",
      businessLicense: undefined,
      authorizationLetter: undefined,
      businessIndustry: "",
      businessAddress: "",
    },
  });

  const handleSignUp = (data: insertUserSchemaType) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!data.businessLicense || !data.authorizationLetter) {
      toast.error("Business license and authorization letter are required");
      return;
    }
    registerMutation.mutate(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { form: data as any },
      {
        onSuccess: () => {
          toast.success("Registration successful!");
          form.reset();
          router.push("/sign-in");
        },
        onError: () => {
          toast.error(
            registerMutation.error
              ? registerMutation.error.message
              : "Registration failed"
          );
        },
      }
    );
  };
  console.log("FORM ERROR", form.formState.errors);
  console.log("REGISTER MUTATION", registerMutation.error);
  return (
    <div className="flex flex-col justify-between  h-full min-h-screen p-4 bg-[#001f3e] text-white">
      <div className="flex flex-col justify-between flex-1 p-16 items-start max-w-7xl mx-auto gap-y-6">
        <div className="flex flex-col items-center w-1/2 mx-auto">
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
        <div className="w-full flex flex-col gap-y-5 font-semibold">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignUp)}
              className="flex flex-col lg:flex-row gap-y-4 w-full gap-x-4"
            >
              <div className="flex flex-col gap-y-4 w-full lg:w-1/2">
                <h1 className="text-3xl font">User Information</h1>
                <CustomInputLabel
                  nameInSchema="name"
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
                <CustomImageUploader
                  nameInSchema="image"
                  fieldTitle="User Image"
                  isPending={false}
                />
                <CustomInputLabel
                  nameInSchema="businessIndustry"
                  fieldTitle="Business industry"
                  placeHolder="Enter business industry"
                />
              </div>
              <div className="flex flex-col gap-y-4 w-full lg:w-1/2">
                <h1 className="text-3xl font">Business Information</h1>

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
                <CustomInputLabel
                  nameInSchema="businessBio"
                  fieldTitle="Business Bio"
                  placeHolder="Enter a brief description of your business"
                />
                <CustomInputLabel
                  nameInSchema="businessWebsite"
                  fieldTitle="Business Website"
                  placeHolder="Enter business website"
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
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="w-full text-sm flex items-center justify-center">
        Have an account?
        <Link href="/sign-in">
          <span className="ml-2 text-blue-700 underline">Sign In</span>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center text-xs mt-4">
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
