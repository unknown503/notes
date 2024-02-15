"use client"
import { Save } from "lucide-react"
import { useIsMobile } from "../common"
import { Button } from "../ui/button"
import { useNotepadContext } from "./NotepadContext"

function ManualSave() {
  const isMobile = useIsMobile()
  const { delayedCallback } = useNotepadContext()

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