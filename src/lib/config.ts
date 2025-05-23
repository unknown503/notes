import { BookText, CaseSensitive, Home, KeyRound, ScrollText } from "lucide-react";

export const GenericTitle = (generic: string) => `${generic} | ${AppConfig.title}`

export const AppConfig = {
  title: process.env.NEXT_PUBLIC_TITLE,
  description: process.env.DESCRIPTION,
  notepadAutoSaveDelay: 25,
  dismissNoteRemovalDelay: 5000,
  defaultFilters: (lower = false, unCat?: boolean) => ((filter => lower ? filter.toLowerCase() : filter)
    (unCat ? "Uncategorized" : "All"))
}

const sidebarItems = [
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

export const availableTabs = (isLoggedIn: boolean) => {
  const returnTabs = isLoggedIn ? tabs : tabs.filter(tab => tab.global)
  return returnTabs.map(tab => tab.label)
}

export const availableSideItems = (isLoggedIn: boolean) =>
  sidebarItems.filter(item =>
    item.authRelated ? !isLoggedIn : item.authRequired ? isLoggedIn : true
  )