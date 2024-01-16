"use client"
import { Save } from "lucide-react"
import { Button } from "../ui/button"
import { useNotepadContext } from "./NotepadContext"
import { useIsMobile } from "../common"

function ManualSave() {
  const { delayedCallback } = useNotepadContext()
  const isMobile = useIsMobile()

  return (
    <Button
      aria-label="Manual save"
      onClick={() => delayedCallback()}
      variant="secondary"
      className="flex gap-2"
    >
      <Save size={20} />
      {!isMobile &&
        "Manual save"
      }
    </Button>
  )
}

export default ManualSave