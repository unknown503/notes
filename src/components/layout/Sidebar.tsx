'use client'
import { AppConfig, availableSideItems } from "@/lib/config"
import { SignOutUser } from "@/lib/db"
import { cn } from "@/lib/utils"
import { LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useUser } from "../common"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Skeleton } from "../ui/skeleton"

export const Sidebar = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("pb-6 lg:pb-10 w-full", className)}>
    <div className="hidden lg:block space-y-4 py-4 h-full">
      <div className="px-3 py-2 h-full">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          <Link href="/">
            {AppConfig.title}
          </Link>
        </h2>
        <div className="flex flex-col justify-between h-full">
          <SidebarItems />
        </div>
      </div>
    </div>
    <div className="block lg:hidden">
      <div className="container pt-3">
        <MobileSidebar />
      </div>
    </div>
  </div>
)

function MobileSidebar() {
  const [Open, setOpen] = useState(false)
  return (
    <Sheet open={Open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="h-full">
          <SheetTitle>
            <Link href="/">
              {AppConfig.title}
            </Link>
          </SheetTitle>
          <SheetDescription className="flex flex-col justify-between h-full">
            <SidebarItems
              setOpen={setOpen}
            />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

function SidebarItems({ setOpen }: { setOpen?: (v: boolean) => void }) {
  const { user, isLoggedIn } = useUser()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      {user === false ?
        <div className="space-y-2">
          <SidebarLoadingItems count={3} />
        </div>
        :
        <>
          <div className="space-y-2">
            {availableSideItems(isLoggedIn).map(item =>
              <Button
                key={item.path}
                variant={pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setOpen && setOpen(false)}
                asChild
              >
                <Link
                  href={item.path}
                  className="flex gap-1.5 items-center"
                >
                  <item.icon size={17} />
                  {item.label}
                </Link>
              </Button>
            )}
          </div>
          {isLoggedIn &&
            <Button
              variant="ghost"
              className="w-full justify-start flex gap-1.5"
              onClick={() => {
                setOpen && setOpen(false)
                SignOutUser()
                router.push("/")
              }}
            >
              <LogOut size={17} />
              Sign-out
            </Button>
          }
        </>
      }
    </>
  )
}


const SidebarLoadingItems = ({ count }: { count: number }) => (
  <>
    {new Array(count).fill(0).map((_, i) =>
      <Skeleton
        className="w-full h-8 rounded-md"
        key={i}
      />
    )}
  </>
)