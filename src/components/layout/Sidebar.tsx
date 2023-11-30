'use client'
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Menu } from "lucide-react"
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Sheet } from "../ui/sheet"
import { AppConfig, sidebarItems } from "@/lib/config"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {

  return (
    <div className={cn("pb-6 lg:pb-12 w-full", className)}>
      <div className="hidden lg:block space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {AppConfig.title}
          </h2>
          <div className="space-y-2">
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
}

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
        <SheetHeader>
          <SheetTitle>
            {AppConfig.title}
          </SheetTitle>
          <SheetDescription className="space-y-2">
            <SidebarItems
              setOpen={setOpen}
            />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default function SidebarItems({ setOpen }: { setOpen?: (v: boolean) => void }) {
  const pathname = usePathname()
  return (
    <>
      {sidebarItems.map(item =>
        <Button
          variant={pathname === item.path ? "secondary" : "ghost"}
          className="w-full justify-start"
          key={item.path}
          asChild
          onClick={() => setOpen && setOpen(false)}
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
    </>
  )
}
