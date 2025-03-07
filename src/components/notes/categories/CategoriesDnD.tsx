import { Button } from "@/components/ui/button"
import { iconList } from "@/icons/categories"
import { CategoryComponentProps } from "@/types/notes"
import { X } from "lucide-react"
import { useEffect, useRef } from "react"
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import KeyIcon from "./KeyIcon"
import { UpdateCategories } from "@/lib/db"


export default function CategoriesDnD({ categories, setCategories }: CategoryComponentProps) {
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    UpdateCategories({ categories })
  }, [categories])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newCategories = Array.from(categories)
    const [removed] = newCategories.splice(result.source.index, 1)
    newCategories.splice(result.destination.index, 0, removed)
    setCategories(newCategories)
  }

  const onCategoryRemove = (id: string) => {
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
              {categories?.map((item, index) => (
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
                      className="border border-gray-600 rounded-lg p-3.5 my-2 flex justify-between categories-center capitalize"
                    >
                      <div className="flex gap-4">
                        <KeyIcon name={item.icon} color={iconList[item.icon as keyof typeof iconList]} />
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
