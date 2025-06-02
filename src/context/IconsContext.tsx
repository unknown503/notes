"use client"
import { ChildrenReceptor } from "@/types/common"
import { Icon } from "@/types/icons"
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"

type IconsContextProps = {
  Icons: Icon[],
  setIcons: Dispatch<SetStateAction<Icon[]>>,
  findBy: (name: string | undefined) => Omit<Icon, "name"> | undefined
}

const IconsContext = createContext<IconsContextProps>({
  Icons: [],
  setIcons: () => { },
  findBy: () => undefined,
})

export function useIconsContext() {
  return useContext(IconsContext)
}

const IconsProvider = ({ children }: ChildrenReceptor) => {
  const [Icons, setIcons] = useState<Icon[]>([])

  const findBy = (name: string | undefined) =>
    Icons?.find(icon => icon.name === name);

  return (
    <IconsContext.Provider value={{ Icons, setIcons, findBy }}>
      {children}
    </IconsContext.Provider>
  )
}

export default IconsProvider