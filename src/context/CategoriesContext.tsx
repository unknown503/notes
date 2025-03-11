"use client"
import { ChildrenReceptor } from "@/types/common"
import { Category } from "@/types/notes"
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"

export type CategoriesContextProps = {
  Categories: Category[],
  setCategories: Dispatch<SetStateAction<Category[]>>,
  findBy: (id: string) => Omit<Category,"id"> | undefined
}

const CategoriesContext = createContext<CategoriesContextProps>({
  Categories: [],
  setCategories: () => { },
  findBy: () => undefined,
})

export function useCategoriesContext() {
  return useContext(CategoriesContext)
}

const CategoriesProvider = ({ children }: ChildrenReceptor) => {
  const [Categories, setCategories] = useState<Category[]>([])

  const findBy = (id: string) =>
    Categories?.find(category => category.id === id);

  return (
    <CategoriesContext.Provider value={{ Categories, setCategories, findBy }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export default CategoriesProvider