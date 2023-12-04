import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isLocal } from "@/lib/config"
import { DeleteNote, UpdateNote } from "@/lib/db"
import { SaveOnLocalStorage, customToast } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CopyButton } from "../common"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { ToastAction } from "../ui/toast"
import { useToast } from "../ui/use-toast"
import dynamic from "next/dynamic"

export type NoteOptionsButtonProps = {
  isPublic: boolean
  id: string
  content: string
  files: string[]
  Hide: boolean
  setHide: (v: boolean) => void
}

const DELAY = 5000

const UpdateNoteModal = dynamic(() => import('@/components/notes/UpdateNoteModal'))

export default function NoteOptionsButton({ isPublic, files, id, content, setHide, Hide }: NoteOptionsButtonProps) {
  const [Open, setOpen] = useState(false)
  const { toast, dismiss } = useToast()

  const RemoveNote = () => {
    setHide(true)
    const timeout = setTimeout(async () => {
      await DeleteNote(id, files)
      dismiss()
    }, DELAY)

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

  const SaveNoteContent = () => {
    const res = SaveOnLocalStorage("note", content)
    if (res !== true) {
      toast(customToast(res, true))
    }
  }

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-[30px]"
            aria-label="Note Options"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`w-56 ${Hide ? "hidden" : ""}`}>
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
                <Link
                  href={`/case`}
                  onClick={SaveNoteContent}
                >
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
