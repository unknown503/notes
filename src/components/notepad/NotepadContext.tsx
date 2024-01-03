"use client"
import { UpdateNotepad } from "@/lib/db"
import { ChildrenReceptor } from "@/types/notes"
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useMemo, useState } from "react"

type ContextType = {
  Notepad: NotepadDoc | null,
  setNotepad: Dispatch<SetStateAction<NotepadDoc | null>>,
  Saving: number | false,
  setSaving: Dispatch<SetStateAction<number | false>>,
  delayedCallback: (shouldBeSaving?: boolean) => Promise<void>
}

const initial: ContextType = {
  Notepad: null,
  setNotepad: () => { },
  Saving: false,
  setSaving: () => { },
  delayedCallback: async () => { }
}

const Context = createContext<ContextType>(initial)

function NotepadContext({ children }: ChildrenReceptor) {
  const [Notepad, setNotepad] = useState<NotepadDoc | null>(null)
  const [Saving, setSaving] = useState<number | false>(false)

  const delayedCallback = useCallback(async (shouldBeSaving = true) => {
    if (!Notepad || (shouldBeSaving && !Saving)) return
    await UpdateNotepad(Notepad.content)
    setSaving(false)
  }, [Notepad, Saving])

  const contextValue = useMemo(() => ({
    Notepad,
    setNotepad,
    Saving,
    setSaving,
    delayedCallback,
  }), [Notepad, Saving, delayedCallback]);

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  )
}

export function useNotepadContext() {
  return useContext(Context);
}

export default NotepadContext