import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteNote, DownloadFile, GetFileName, UpdateNote } from "@/lib/db"
import { SaveOnLocalStorage, customToast } from "@/lib/utils"
import { NoteDoc } from "@/types/notes"
import { MoreHorizontal } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { CopyButton, useIsOffline, useUser } from "../common"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { ToastAction } from "../ui/toast"
import { useToast } from "../ui/use-toast"

export type NoteOptionsButtonProps = NoteDoc & {
  Hide: boolean
  setHide: (v: boolean) => void
}

const DELAY = 5000

const UpdateNoteModal = dynamic(() => import('@/components/notes/UpdateNoteModal'))

export default function NoteOptionsButton({ isPublic, files, id, content, setHide, Hide, isCritical }: NoteOptionsButtonProps) {
  const [Open, setOpen] = useState(false)
  const { toast, dismiss } = useToast()
  const { isLoggedIn } = useUser()
  const isOffline = useIsOffline()

  const DownloadAll = () => {
    files.map(file => {
      const name = GetFileName(file)
      DownloadFile(file, name)
    })
    toast(customToast("All files downloaded."))
  }

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

  const UpdateIsCritical = async () => {
    await UpdateNote(id, {
      isCritical: !isCritical
    })
    toast(customToast(`Note changed to ${isCritical ? "not " : ""}critical.`))
  }

  const SaveNoteContent = () => {
    const res = SaveOnLocalStorage("note", content)
    if (res !== true) toast(customToast(res, true))
  }
  console.log(files)

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-[30px] ${!isLoggedIn && content === "" ? "hidden" : ""}`}
            aria-label="Note Options"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`w-56 ${Hide ? "hidden" : ""}`}>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {content !== "" &&
            <CopyButton
              textToCopy={content}
              kind="generic"
            >
              <DropdownMenuCheckboxItem className="cursor-pointer">
                Copy note
              </DropdownMenuCheckboxItem>
            </CopyButton>
          }
          {isLoggedIn && !isOffline &&
            <>
              <DialogTrigger asChild>
                <DropdownMenuCheckboxItem className="cursor-pointer">
                  Update note
                </DropdownMenuCheckboxItem>
              </DialogTrigger>
              <DropdownMenuCheckboxItem
                className="cursor-pointer"
                onClick={UpdateIsPublic}
              >
                Set to {!isPublic ? "public" : "private"}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="cursor-pointer"
                onClick={UpdateIsCritical}
              >
                Set to {isCritical ? "not " : ""}critical
              </DropdownMenuCheckboxItem>
            </>
          }
          {files.length !== 0 &&
            <DropdownMenuCheckboxItem
              className="cursor-pointer"
              onClick={DownloadAll}
            >
              Download All
            </DropdownMenuCheckboxItem>
          }
          {content !== "" &&
            <DropdownMenuCheckboxItem className="cursor-pointer">
              <Link
                href="/case"
                onClick={SaveNoteContent}
              >
                Convert content
              </Link>
            </DropdownMenuCheckboxItem>
          }
          {isLoggedIn && !isOffline &&
            <DropdownMenuCheckboxItem
              className="cursor-pointer"
              onClick={RemoveNote}
            >
              Delete note
            </DropdownMenuCheckboxItem>
          }
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
