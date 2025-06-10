"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { GoHome, GoHomeFill, GoPlus, GoFile } from "react-icons/go";
import { FaFile } from "react-icons/fa";
import Image from "next/image";
import MemberAvatar from "./member-avatar";
import { Skeleton } from "./ui/skeleton";
import { useCurrentUser } from "@/features/auth/api/current-user";
import { LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/api/logout";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "./ui/button";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";

const routes = [
  { label: "Home", href: "/home", icon: GoHome, activeIcon: GoHomeFill },
  {
    label: "Listing",
    href: "/listing",
    icon: GoPlus,
    activeIcon: GoPlus,
  },
  {
    label: "My Listings",
    href: "/my-listings",
    icon: GoFile,
    activeIcon: FaFile,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: CiBookmark,
    activeIcon: FaBookmark,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();

  const [ConfirmDialog, confirm] = useConfirm(
    "Logout Confirmation",
    "Are you sure you want to log out? This action cannot be undone.",
    {
      variant: "destructive",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
    }
  );

  const handleLogout = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push("/sign-in");
      },
      onError: () => {
        toast.error("An error occured while logging out");
      },
    });
  };
  return (
    <div className="flex flex-col gap-4 p-4 h-screen fixed top-0 left-0 w-72 bg-[#001f3e]">
      <ConfirmDialog />
      <div className="relative w-64 h-24">
        <div className="flex items-center justify-start w-full h-28 mb-2">
          <div className="relative w-48 h-20">
            <Image
              src="/images/mainLogo.png"
              alt="mainlogo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <ul className="flex flex-col flex-1">
        {routes.map((item) => {
          const fullHref = item.href;
          const isActive = pathname === fullHref;
          const Icon = isActive ? item.activeIcon : item.icon;
          return (
            <Link key={item.href} href={fullHref}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium text-primary-foreground transition",
                  isActive &&
                    "bg-white shadow-sm hover:opacity-100 text-primary"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </ul>
      {isLoading ? (
        <Skeleton className="h-14 w-full" />
      ) : (
        data &&
        !Array.isArray(data) && (
          <div
            className="flex items-center gap-x-3 cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <MemberAvatar name={data.name} className="size-12" />
            <div className="flex flex-col gap-y-1">
              <h1 className="text-white">{data.name}</h1>
              <p className="text-sm text-white">{data.email}</p>
            </div>
          </div>
        )
      )}
      <Button
        className="flex mt-auto p-4 text-white hover:text-red-300 justify-center gap-12 items-center cursor-pointer h-12 rounded-xs bg-transparent hover:bg-transparent hover:opacity-80"
        onClick={handleLogout}
        variant="outline"
        disabled={logoutMutation.isPending}
      >
        <p className="text-lg">Logout</p>
        <LogOut className="size-4" />
      </Button>
    </div>
  );
}
