import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/UserContext"
import { SignOutUser } from "@/lib/db"
import { Ellipsis, LogIn, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { SettingsDialog } from "./SettingsDialog"

export default function Footer() {
  const { isMobile, setOpenMobile } = useSidebar()
  const { isLoggedIn } = useUser()
  const router = useRouter()

  const logOut = () => {
    setOpenMobile(false)
    SignOutUser()
    router.push("/")
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <Dialog>
            <DropdownMenu modal={isMobile}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <span className="text-sm leading-tight">More options</span>
                  <Ellipsis className="ml-auto !size-6" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel>More options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup >
                  {isLoggedIn &&
                    <DialogTrigger asChild>
                      <DropdownMenuItem>
                        <Settings />
                        Settings
                      </DropdownMenuItem>
                    </DialogTrigger>
                  }
                </DropdownMenuGroup>
                {isLoggedIn ?
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logOut}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </>
                  :
                  <DropdownMenuItem onClick={() => {
                    router.push("/auth")
                    setOpenMobile(false)
                  }}>
                    <LogIn />
                    Log In
                  </DropdownMenuItem>
                }
              </DropdownMenuContent>
            </DropdownMenu>
            <SettingsDialog />
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
