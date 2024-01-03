type NotepadDoc = {
  content: string
  timestamp: number
}

type NotepadHistoryDoc = {
  records: NotepadDoc[]
}