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
import { Settings } from 'lucide-react'
import { CopyButton } from '../common'
import { Button } from '../ui/button'
import { useNotepadContext } from './NotepadContext'
import { useEffect, useState } from "react"
import { SaveOnLocalStorage } from "@/lib/utils"

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
    setSaving(Date.now() + 1000)
    delayedCallback()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="flex gap-2"
        >
          <Settings size={20} />
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => delayedCallback()}
        >
          Save manually
        </DropdownMenuItem>
        <CopyButton
          textToCopy={Notepad?.content}
          kind="generic"
        >
          <DropdownMenuItem>
            Copy note
          </DropdownMenuItem>
        </CopyButton>
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
