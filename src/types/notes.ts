type NoteDoc = {
  id: string
  content: string,
  files: string[]
  isPublic: boolean
  timestamp: number
}

type UpdateNoteFields = {
  content?: string,
  files?: string[]
  isPublic?: boolean
}