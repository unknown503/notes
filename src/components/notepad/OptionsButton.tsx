"use client"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SaveOnLocalStorage } from "@/lib/utils"
import { Copy, Settings } from 'lucide-react'
import { useEffect } from "react"
import { CopyButton } from '../common'
import { Button } from '../ui/button'
import { useNotepadContext } from './NotepadContext'

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
    console.log("!state")

    Notepad && setSaving(Notepad?.timestamp)
    delayedCallback()
  }

  return (
    <DropdownMenu>
      <div className="flex gap-4">
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
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="flex gap-2"
          >
            <Settings size={20} />
            Options
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => delayedCallback()}
        >
          Save manually
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem
          checked={AutoSave}
          onCheckedChange={onManualSaveTrigger}
        >
          Auto save
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
