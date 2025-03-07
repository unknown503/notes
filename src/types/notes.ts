import { Dispatch, SetStateAction } from "react"

export type NoteDoc = {
  id: string
  content: string
  files: string[]
  isPublic: boolean
  timestamp: number
  isCritical: boolean
}

export type UpdateNoteFields = {
  content?: string
  files?: string[]
  isPublic?: boolean
  isCritical?: boolean
}

export type CategoriesDoc = {
  categories: Category[]
}

export type Category = {
  id: string
  content: string
  icon: string
}

export type CategoryComponentProps = {
  setCategories: Dispatch<SetStateAction<Category[]>>
} & CategoriesDoc