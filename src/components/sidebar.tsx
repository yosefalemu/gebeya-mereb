"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { GoHome, GoHomeFill, GoPlus, GoFile } from "react-icons/go";
import { MdMessage } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { FaFile } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { MdOutlineHelpOutline } from "react-icons/md";
import { MdOutlineHelp } from "react-icons/md";
import Image from "next/image";
import MemberAvatar from "./member-avatar";
const routes = [
  { label: "Home", href: "/home", icon: GoHome, activeIcon: GoHomeFill },
  {
    label: "New Listing",
    href: "/new-listing",
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
    label: "Messages",
    href: "/messages",
    icon: MdOutlineMessage,
    activeIcon: MdMessage,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: IoSettingsOutline,
    activeIcon: IoSettings,
  },
  {
    label: "Support",
    href: "/support",
    icon: MdOutlineHelpOutline,
    activeIcon: MdOutlineHelp,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  console.log("PATH NAME", pathname);
  return (
    <div className="flex flex-col gap-4 p-4 h-screen">
      <div className="relative w-64 h-24">
        <Image src="/images/mainLogo.png" alt="mainlogo" fill />
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
      <div className="flex items-center gap-x-3">
        <MemberAvatar name="Abebe" className="size-12" />
        <div className="flex flex-col gap-y-1">
          <h1>Abebe</h1>
          <p className="text-sm">abebebalemu007@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
