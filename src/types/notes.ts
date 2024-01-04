import { ReactNode } from "react"

export type NoteDoc = {
  id: string
  content: string,
  files: string[]
  isPublic: boolean
  timestamp: number
  isCritical: boolean
}

export type UpdateNoteFields = {
  content?: string,
  files?: string[]
  isPublic?: boolean
  isCritical?: boolean
}

export type ChildrenReceptor = {
  children: ReactNode
}