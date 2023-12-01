import { BookText, CaseSensitive, Home, KeyRound } from "lucide-react";

export const isLocal = Boolean(process.env.NEXT_PUBLIC_LOCAL_ENV === "true")

export const GenericTitle = (generic: string) => `${generic} - ${AppConfig.title}`

export const AppConfig = {
  title: "Notiz",
  description: "Notiz"
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
    authRequired: true,
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

export const availableTabs = () => {
  const returnTabs = isLocal ? tabs : publicTabs
  return { tabs: returnTabs.map(tab => tab.label) }
}

export const availableSideItems = (isLoggedIn: boolean) =>
  sidebarItems.filter(item =>
    item.authRelated ? !isLoggedIn : item.authRequired ? isLoggedIn : true
  )