"use client";

import { Calendar, Home, Inbox, Search, Settings, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { api } from "@/trpc/react";
import { useMemo } from "react";


export function AppSidebar({ id: tournamentId }: { id: string }) {
  const { data: { tournament } = {} } = api.tournaments.getById.useQuery({ id: tournamentId });
  const items = useMemo(() => {
    return [
      {
        title: "Home",
        url: `/tournaments/${tournamentId}`,
        icon: Home,
      },
      {
        title: "Participants",
        url: `/tournaments/${tournamentId}/participants`,
        icon: Users,
      }
    ]
  }, [tournamentId])
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md font-bold">{tournament?.name}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
