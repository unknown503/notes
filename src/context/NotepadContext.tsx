"use client"
import { UpdateNotepad } from "@/lib/db"
import { RemoveLastDot } from "@/lib/utils"
import { ChildrenReceptor } from "@/types/common"
import { NotepadDoc } from "@/types/notepad"
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useMemo, useState } from "react"

type ContextType = {
  Notepad: NotepadDoc | null,
  setNotepad: Dispatch<SetStateAction<NotepadDoc | null>>,
  Saving: number | false,
  setSaving: Dispatch<SetStateAction<number | false>>,
  AutoSave: boolean,
  setAutoSave: Dispatch<SetStateAction<boolean>>,
  delayedCallback: (shouldBeSaving?: boolean) => Promise<void>
}

const initial: ContextType = {
  Notepad: null,
  setNotepad: () => { },
  Saving: false,
  setSaving: () => { },
  AutoSave: false,
  setAutoSave: () => { },
  delayedCallback: async () => { }
}

const Context = createContext<ContextType>(initial)

function NotepadContext({ children }: ChildrenReceptor) {
  const [Notepad, setNotepad] = useState<NotepadDoc | null>(null)
  const [Saving, setSaving] = useState<number | false>(false)
  const [AutoSave, setAutoSave] = useState(true)

  const delayedCallback = useCallback(async () => {
    if (!Notepad || !Saving) return
    await UpdateNotepad(RemoveLastDot(Notepad.content).trim())
    setSaving(false)
  }, [Notepad, Saving])

  const contextValue = useMemo(() => ({
    Notepad,
    setNotepad,
    Saving,
    setSaving,
    delayedCallback,
    AutoSave,
    setAutoSave
  }), [Notepad, Saving, delayedCallback, AutoSave]);

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  )
}

export const useNotepadContext = () => useContext(Context)

export default NotepadContext