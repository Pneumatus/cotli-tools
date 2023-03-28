import React from "react";
import {
  Cog8ToothIcon,
  DocumentIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { NavItem } from "./Sidebar";

export const defaultNavItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="w-6 h-6" />,
  },
  {
    label: "Dungeon Season Claim",
    href: "/dungeon-season-claim",
    icon: <DocumentIcon className="w-6 h-6" />,
  },
  {
    label: "User Settings",
    href: "/user-settings",
    icon: <Cog8ToothIcon className="w-6 h-6" />,
  },
];
