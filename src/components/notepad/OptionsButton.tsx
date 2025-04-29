"use client"
import { SaveOnLocalStorage } from "@/lib/utils"
import { Check, Copy, Save } from 'lucide-react'
import { useEffect } from "react"
import { useNotepadContext } from '../../context/NotepadContext'
import { CopyButton } from "../lib/lib"
import { Button } from '../ui/button'

const MSKey = "manual-save"

export default function OptionsButton() {
  const { Notepad, delayedCallback, setAutoSave, AutoSave, setSaving } = useNotepadContext()

  useEffect(() => {
    const enabledManualSave = localStorage.getItem(MSKey)
    if (enabledManualSave === null) return
    setAutoSave(Boolean(JSON.parse(enabledManualSave)))
  }, [])

  const onManualSaveTrigger = () => {
    const state = !AutoSave
    SaveOnLocalStorage(MSKey, String(state))
    setAutoSave(state)

    if (!state) return

    Notepad && setSaving(Notepad?.timestamp)
    delayedCallback()
  }

  return (
    <div className="flex gap-3">
      <CopyButton
        kind='generic'
        textToCopy={Notepad?.content}
      >
        <Button
          variant="outline"
          size="icon"
          title="Copy content"
        >
          <Copy size={16} />
        </Button>
      </CopyButton>
      <Button
        variant="outline"
        size="icon"
        title="Save manually"
        onClick={() => delayedCallback()}
      >
        <Save size={16} />
      </Button>
      <Button
        variant="outline"
        title="Auto save"
        className="flex gap-2"
        onClick={onManualSaveTrigger}
      >
        <div className="size-4">
          {AutoSave &&
            <Check size={16} />
          }
        </div>
        Auto save
      </Button>
    </div>
  )
}
