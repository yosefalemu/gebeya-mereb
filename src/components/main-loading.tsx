"use client";
import { Loader } from "lucide-react";

export default function LoadingLayout() {
  return (
    <div className="absolute h-full w-full flex items-center justify-center bg-neutral-50/60 z-50">
      <Loader className="animate-spin text-neutral-400" size={24} />
    </div>
  );
}
