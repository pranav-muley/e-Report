"use client"

import {
  Bot,
  Settings2,
  SquareTerminal
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/layout/sidebar/nav-main"
import { NavUser } from "@/components/layout/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Anmol",
    email: "anmol@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      hasChilds: false
    },
    {
      title: "Reports",
      url: "#",
      icon: Bot,
      hasChilds: true,
      items: [
        {
          title: "Section-1",
          url: `/reports/section-1`,
        },
        {
          title: "Section-2",
          url: "/reports/section-2",
        },
        {
          title: "Section-3",
          url: "/reports/section-3",
        },
        {
          title: "Section-4",
          url: "/reports/section-4",
        },
        {
          title: "Section-5",
          url: "/reports/section-5",
        },
      ],
    },
    {
      title: "Analyze",
      url: "#",
      icon: Settings2,
      hasChilds: false
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="dark:border dark:border-accent">
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
