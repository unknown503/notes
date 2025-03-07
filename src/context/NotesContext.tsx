"use client"

import { ChildrenReceptor } from "@/types/common"
import { NoteDoc } from "@/types/notes"
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"

type NotesContextProps = {
  Notes: NoteDoc[] | null,
  setNotes: Dispatch<SetStateAction<NoteDoc[] | null>>
}

const NotesContext = createContext<NotesContextProps>({
  Notes: null,
  setNotes: () => { },
})

export function useNotesContext() {
  return useContext(NotesContext)
}

const NotesProvider = ({ children }: ChildrenReceptor) => {
  const [Notes, setNotes] = useState<NoteDoc[] | null>(null)

  return (
    <NotesContext.Provider value={{ Notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  )
}

export default NotesProvider