interface NoteDoc {
  id: string
  content: string,
  files: string[]
  isPublic: boolean
  timestamp: number
}

interface UpdateNoteFields {
  content?: string,
  files?: string[]
  isPublic?: boolean
}