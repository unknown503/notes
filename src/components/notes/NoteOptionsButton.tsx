import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { DeleteNote, UpdateNote } from "@/lib/db"
import { customToast } from "@/lib/utils"
import { useToast } from "../ui/use-toast"
import { ToastAction } from "../ui/toast"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { useState } from "react"
import { UpdateNoteModal } from "./UpdateNoteModal"
import { CopyButton } from "../common"
import Link from "next/link"
import { isLocal } from "@/lib/config"


interface NoteOptionsButtonProps {
  isPublic: boolean
  id: string
  content: string
  files: string[]
  setHide: (v: boolean) => void
}

const DELAY = 5000

export function NoteOptionsButton({ isPublic, files, id, content, setHide }: NoteOptionsButtonProps) {
  const [Open, setOpen] = useState(false);
  const { toast, dismiss } = useToast()

  const RemoveNote = () => {
    setHide(true)
    const timeout = setTimeout(async () => {
      await DeleteNote(id, files)
      dismiss()
    }, DELAY);

    toast({
      ...customToast("Note removed."),
      duration: DELAY,
      action:
        <ToastAction
          altText="Undo"
          onClick={() => {
            clearTimeout(timeout)
            setHide(false)
          }}
        >
          Undo
        </ToastAction>
    })
  }

  const UpdateIsPublic = async () => {
    await UpdateNote(id, {
      isPublic: !isPublic
    })
    toast(customToast(`Note changed to ${!isPublic ? "public" : "private"}.`))
  }

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-[30px]">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuCheckboxItem className="cursor-pointer">
              Update note
            </DropdownMenuCheckboxItem>
          </DialogTrigger>
          {isLocal &&
            <DropdownMenuCheckboxItem
              className="cursor-pointer"
              onClick={UpdateIsPublic}
            >
              Set to {!isPublic ? "public" : "private"}
            </DropdownMenuCheckboxItem>
          }
          {content !== "" &&
            <>
              <DropdownMenuCheckboxItem className="cursor-pointer">
                <Link href={`/case?text=${content}`}>
                  Convert content
                </Link>
              </DropdownMenuCheckboxItem>
              <CopyButton
                textToCopy={content}
                kind="generic"
              >
                <DropdownMenuCheckboxItem className="cursor-pointer">
                  Copy note
                </DropdownMenuCheckboxItem>
              </CopyButton>
            </>
          }
          <DropdownMenuCheckboxItem
            className="cursor-pointer"
            onClick={RemoveNote}
          >
            Delete note
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateNoteModal
        content={content}
        files={files}
        id={id}
        setOpen={setOpen}
      />
    </Dialog>
  )
}
