"use client"
import { SubscribeToNotepadHistory } from "@/lib/db"
import { isWithinThisWeek } from "@/lib/utils"
import { ChildrenReceptor } from "@/types/common"
import { NotepadWeeks } from "@/types/notepad"
import { createContext, useContext, useEffect, useState } from "react"

type ContextType = {
  Records: NotepadWeeks | null,
}

const Context = createContext<ContextType>({ Records: null })

function HistoryProvider({ children }: ChildrenReceptor) {
  const [Records, setRecords] = useState<NotepadWeeks | null>(null)

  useEffect(() => {
    const unsubscribe = SubscribeToNotepadHistory(docs => {
      const records = docs.records.sort((a, b) => b.timestamp - a.timestamp)
      const weeks: NotepadWeeks = {
        thisWeek: records.filter(record => isWithinThisWeek(record.timestamp)),
        lastWeek: records.filter(record => !isWithinThisWeek(record.timestamp)),
      }

      setRecords(weeks)
    })
    return () => unsubscribe()
  }, [])

  return (
    <Context.Provider value={{ Records }}>
      {children}
    </Context.Provider>
  )
}

export const useHistoryContext = () => useContext(Context)
export default HistoryProvider