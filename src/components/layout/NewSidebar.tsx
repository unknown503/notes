"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { useUser } from "@/context/UserContext"
import { availableSideItems } from "@/lib/config"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import Footer from "./sidebar/Footer"
import Header from "./sidebar/Header"

const SidebarMenuSkeleton = dynamic(() => import('@/components/ui/sidebar').then((m) => m.SidebarMenuSkeleton))

export function NewSidebar() {
  const { isLoggedIn } = useUser()
  const pathname = usePathname()
  return (
    <Sidebar>
      <Header />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!isLoggedIn ?
                Array.from({ length: 3 }).map((_, index) =>
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ) :
                availableSideItems(isLoggedIn).map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={pathname === item.path}>
                      <a href={item.path}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Footer />
    </Sidebar>
  )
}
