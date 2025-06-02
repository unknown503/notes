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

const NotesProvider = ({ children }: ChildrenReceptor) => {
  const [Notes, setNotes] = useState<NoteDoc[] | null>(null)

  return (
    <NotesContext.Provider value={{ Notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotesContext = () => useContext(NotesContext)
export default NotesProvider