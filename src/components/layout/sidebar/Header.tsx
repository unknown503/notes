import { SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { AppConfig } from '@/lib/config'
import { StickyNote } from 'lucide-react'

export default function Header() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <StickyNote className="size-4" color='white' />
            </div>
            <span className="font-semibold text-sm leading-tight">
              {AppConfig.title}
            </span>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
