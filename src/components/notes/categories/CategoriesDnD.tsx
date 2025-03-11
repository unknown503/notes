import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CategoriesContextProps } from "@/context/CategoriesContext"
import { iconList } from "@/icons/categories"
import { UpdateCategories } from "@/lib/db"
import { customToast } from "@/lib/utils"
import { X } from "lucide-react"
import { useEffect, useRef } from "react"
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import KeyIcon from "./KeyIcon"

export default function CategoriesDnD({ Categories, setCategories }: Omit<CategoriesContextProps, "findBy">) {
  const initialRender = useRef(true);
  const { toast } = useToast()

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    UpdateCategories({ categories: Categories })
  }, [Categories])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newCategories = Array.from(Categories)
    const [removed] = newCategories.splice(result.source.index, 1)
    newCategories.splice(result.destination.index, 0, removed)
    setCategories(newCategories)
  }

  const onCategoryRemove = (id: string) => {
    toast(customToast("Category removed."))
    setCategories(prevCategories =>
      prevCategories.filter(category => category.id !== id)
    )
  }

  return (
    <div className="relative">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Categories?.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        transition: 'background-color 0.2s',
                        ...provided.draggableProps.style,
                        left: "auto !important",
                        top: "auto !important",
                      }}
                      className="border border-gray-600 rounded-lg p-3.5 my-2 flex justify-between items-center capitalize"
                    >
                      <div className="flex gap-4">
                        <KeyIcon name={item.icon} color={item.icon} />
                        {item.content}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="!size-6"
                        onClick={() => onCategoryRemove(item.id)}
                      >
                        <X size={20} />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
