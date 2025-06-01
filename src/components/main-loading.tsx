"use client";
import { Loader } from "lucide-react";
import { useLoadingStore } from "@/store/loading-store";

export default function LoadingLayout() {
  const { isLoading } = useLoadingStore();
  return (
    <div
      className={`${
        isLoading
          ? "absolute h-full w-full flex items-center justify-center bg-neutral-50/60 z-50"
          : "hidden"
      }`}
    >
      <Loader className="animate-spin text-neutral-400" size={24} />
    </div>
  );
}
