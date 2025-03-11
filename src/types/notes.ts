export type NoteDoc = {
  id: string
  content: string
  files: string[]
  isPublic: boolean
  timestamp: number
  categoryId: string
}

export type UpdateNoteFields = {
  content?: string
  files?: string[]
  isPublic?: boolean
  categoryId?: string
}

export type CategoriesDoc = {
  categories: Category[]
}

export type Category = {
  id: string
  content: string
  icon: string
}
