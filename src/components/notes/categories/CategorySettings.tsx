"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCategoriesContext } from "@/context/CategoriesContext"
import { ChildrenReceptor } from "@/types/common"
import { ScrollArea } from "../../ui/scroll-area"
import CategoriesDnD from "./CategoriesDnD"
import CategoryForm from "./CategoryForm"

export default function CategorySettings({ children }: ChildrenReceptor) {
  const { Categories, setCategories } = useCategoriesContext()

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            Categories
          </DialogTitle>
          <DialogDescription className="sr-only">
            Categories
          </DialogDescription>
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

