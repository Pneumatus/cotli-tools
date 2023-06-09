import React from "react";
import {
  ArrowPathIcon,
  CalendarIcon,
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
    label: "Event Schedule",
    href: "/event-schedule",
    icon: <CalendarIcon className="w-6 h-6" />,
  },
  {
    label: "Challenges",
    href: "/challenges",
    icon: <CalendarIcon className="w-6 h-6" />,
  },
  {
    label: "Talent Reset",
    href: "/talent-reset",
    icon: <ArrowPathIcon className="w-6 h-6" />,
  },
  {
    label: "User Settings",
    href: "/user-settings",
    icon: <Cog8ToothIcon className="w-6 h-6" />,
  },
];
