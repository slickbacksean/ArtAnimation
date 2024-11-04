import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
      {
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/projects",
        icon: "folder",
        title: "Projects",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/animation-studio",
        icon: "play",
        title: "Animation Studio",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "#/dashboard/posts",
        icon: "post",
        title: "User Posts",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
  {
    title: "ANIMATIONS",
    items: [
      {
        href: "/dashboard/animations/rotate",
        icon: "rotate",
        title: "Rotate",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/animations/scale",
        icon: "maximize",
        title: "Scale",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/animations/translate",
        icon: "move",
        title: "Translate",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/animations/fade",
        icon: "eye",
        title: "Fade",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/animations/color-shift",
        icon: "palette",
        title: "Color Shift",
        authorizeOnly: UserRole.USER,
      },
    ],
  },
]