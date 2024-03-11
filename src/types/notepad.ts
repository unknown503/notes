type NotepadDoc = {
  content: string
  timestamp: number
}

type NotepadHistoryDoc = {
  records: NotepadDoc[]
}

type WeeklyRecordsType = {
  range: {
    from: string,
    to: string,
  },
  records: NotepadDoc[]
}