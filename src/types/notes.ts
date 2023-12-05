type NoteDoc = {
  id: string
  content: string,
  files: string[]
  isPublic: boolean
  timestamp: number
  isCritical: boolean
}

type UpdateNoteFields = {
  content?: string,
  files?: string[]
  isPublic?: boolean
  isCritical?: boolean
}