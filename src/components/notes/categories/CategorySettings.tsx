"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { GetCategories } from "@/lib/db"
import { ChildrenReceptor } from "@/types/common"
import { Category } from "@/types/notes"
import { useEffect, useState } from "react"
import { ScrollArea } from "../../ui/scroll-area"
import CategoriesDnD from "./CategoriesDnD"
import CategoryForm from "./CategoryForm"

export default function CategorySettings({ children }: ChildrenReceptor) {
  const [Open, setOpen] = useState(false)
  const [Categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    GetCategories().then(res => 
      setCategories(res.categories)
    )
  }, [])

  return (
    <Dialog open={Open} onOpenChange={setOpen} >
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
            categories={Categories}
            setCategories={setCategories}
          />
          <ScrollArea customClass="max-h-[20rem] min-h-[20rem] pr-2 relative">
            <CategoriesDnD
              categories={Categories}
              setCategories={setCategories}
            />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

