"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    isDefault?: boolean
  }
>(({ className, isDefault, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(`inline-flex items-center justify-center ${!isDefault ?
      "h-9 rounded-lg bg-muted p-1 text-muted-foreground" :
      "h-10 py-1 pb-0.5 gap-5"}`,
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    isDefault?: boolean
  }
>(({ className, isDefault, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 
    ${!isDefault ? "min-w-[100px] rounded-md px-3 py-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow" :
        "capitalize p-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-primary min-w-[40px]"}`,
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    isDefault?: boolean
  }
>(({ className, isDefault, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(`mt-2 ${!isDefault ?
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" : ""}`,
      className
    )}
    tabIndex={-1}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
