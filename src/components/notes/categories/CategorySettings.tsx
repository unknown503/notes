"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCategoriesContext } from "@/context/CategoriesContext"
import { GetCategories } from "@/lib/db"
import { ChildrenReceptor } from "@/types/common"
import { useEffect } from "react"
import { ScrollArea } from "../../ui/scroll-area"
import CategoriesDnD from "./CategoriesDnD"
import CategoryForm from "./CategoryForm"

export default function CategorySettings({ children }: ChildrenReceptor) {
  const { Categories, setCategories } = useCategoriesContext()

  useEffect(() => {
    GetCategories().then(res => setCategories(res.categories))
  }, [])

  return (
    <Dialog>
      <div className="flex gap-3">
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            Categories
          </DialogTitle>
          <CategoryForm
            setCategories={setCategories}
          />
          <ScrollArea customClass="max-h-[20rem] min-h-[20rem] pr-2 relative">
            <CategoriesDnD
              Categories={Categories}
              setCategories={setCategories}
            />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

