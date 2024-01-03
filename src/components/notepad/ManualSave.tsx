"use client"

import { Save } from "lucide-react"
import { Button } from "../ui/button"
import { useNotepadContext } from "./NotepadContext"

function ManualSave() {
  const { delayedCallback } = useNotepadContext()

  return (
    <Button
      aria-label="Manual save"
      onClick={() => delayedCallback()}
    >
      <Save size={20} className="mr-2" />
      Manual save
    </Button>
  )
}

export default ManualSave