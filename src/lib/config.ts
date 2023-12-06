import { BookText, CaseSensitive, Home, KeyRound, ScrollText } from "lucide-react";

export const GenericTitle = (generic: string) => `${generic} | ${AppConfig.title}`

export const AppConfig = {
  title: process.env.NEXT_PUBLIC_TITLE,
  description: process.env.DESCRIPTION,
}

export const sidebarItems = [
  {
    label: "Home",
    icon: Home,
    path: "/",
    authRequired: false,
  },
  {
    label: "Notes",
    icon: BookText,
    path: "/notes",
    authRequired: false,
  },
  {
    label: "Convert case",
    icon: CaseSensitive,
    path: "/case",
    authRequired: false
  },
  {
    label: "Auth",
    icon: KeyRound,
    path: "/auth",
    authRelated: true,
    authRequired: false
  },
  {
    label: "Notepad",
    icon: ScrollText,
    path: "/notepad",
    authRequired: true
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

export const availableTabs = (isLoggedIn: boolean) => {
  const returnTabs = isLoggedIn ? tabs : publicTabs
  return returnTabs.map(tab => tab.label)
}

export const availableSideItems = (isLoggedIn: boolean) =>
  sidebarItems.filter(item =>
    item.authRelated ? !isLoggedIn : item.authRequired ? isLoggedIn : true
  )