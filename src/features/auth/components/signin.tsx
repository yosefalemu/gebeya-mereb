"use client";
import CustomInputLabel from "@/components/inputs/custom-input";
import CustomPasswordInput from "@/components/inputs/custom-password-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function SignInCard() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
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
        <div className="w-1/2 flex flex-col gap-y-5">
          <h1>USER LOGIN</h1>
          <Form {...form}>
            <form
              onSubmit={() => console.log("SUBMOTED")}
              className="flex flex-col gap-y-4"
            >
              <CustomInputLabel
                nameInSchema="email"
                fieldTitle="Email"
                placeHolder="Enter email"
              />
              <CustomPasswordInput
                nameInSchema="password"
                fieldTitle="Password"
                placeHolder="Enter password"
                className="h-12"
              />
              <Button className="w-full h-12 cursor-pointer">Login</Button>
              <div className="w-full text-sm flex items-center justify-center">
                Don&rsquo;t have an account?
                <Link href="/sign-up">
                  <span className="ml-2 text-blue-700 underline">Sign Up</span>
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
