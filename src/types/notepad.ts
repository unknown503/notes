export type NotepadWeeks = {
  thisWeek: NotepadDoc[],
  lastWeek: NotepadDoc[]
}

export type NotepadDoc = {
  content: string
  timestamp: number
}

export type NotepadHistoryDoc = {
  records: NotepadDoc[]
}