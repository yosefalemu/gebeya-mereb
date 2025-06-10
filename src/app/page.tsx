"use client";
import LoadingLayout from "@/components/main-loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Set a 3-second delay before redirecting
    const timer = setTimeout(() => {
      router.push("/sign-in");
    }, 3000);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  // Display the loading layout
  return <LoadingLayout />;
}
