import { BookText, CaseSensitive } from "lucide-react";

export const GenericTitle = (generic: string) => `${generic} - ${AppConfig.title}`

export const AppConfig = {
  title: "App",
  description: "Generic description"
}

export const sidebarItems = [
  {
    label: "Notes",
    icon: BookText,
    path: "/"
  },
  {
    label: "Convert case",
    icon: CaseSensitive,
    path: "/case"
  },
]

const tabs = [
  {
    label: "all",
    global: false
  },
  {
    label: "public",
    global: true
  },
  {
    label: "private",
    global: false
  },
]

const publicTabs = tabs.filter(tab => tab.global)
export const isLocal = Boolean(process.env.NEXT_PUBLIC_LOCAL_ENV === "true")

export const availableTabs = () => {
  const returnTabs = isLocal ? tabs : publicTabs
  return { tabs: returnTabs.map(tab => tab.label) }
}
