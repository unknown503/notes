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
import { Dialog, DialogTrigger } from "../ui/dialog"
import { ToastAction } from "../ui/toast"
import { useToast } from "../ui/use-toast"
import { useUser } from "@/context/UserContext"
import { CopyButton } from "../lib/lib"
import { AppConfig } from "@/lib/config"

export type NoteOptionsButtonProps = NoteDoc & {
  Hide: boolean
  setHide: (v: boolean) => void
}

const UpdateNoteModal = dynamic(() => import('@/components/notes/UpdateNoteModal'))

export default function NoteOptionsButton({ isPublic, files, id, content, categoryId, setHide, Hide }: NoteOptionsButtonProps) {
  const [Open, setOpen] = useState(false)
  const { toast, dismiss } = useToast()
  const { isLoggedIn } = useUser()

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
    }, AppConfig.dismissNoteRemovalDelay)

    toast({
      ...customToast("Note removed."),
      duration: AppConfig.dismissNoteRemovalDelay,
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
    if (res !== true) toast(customToast(res, true))
  }

  const toggleDialog = (open: boolean) => {
    setOpen(open)
    setTimeout(() => document.body.style.pointerEvents = "", 300)
  }

  return (
    <Dialog open={Open} onOpenChange={toggleDialog}>
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
              <DropdownMenuCheckboxItem>
                Copy content
              </DropdownMenuCheckboxItem>
            </CopyButton>
          }
          {isLoggedIn &&
            <>
              <DialogTrigger asChild>
                <DropdownMenuCheckboxItem>
                  Update note
                </DropdownMenuCheckboxItem>
              </DialogTrigger>
              <DropdownMenuCheckboxItem
                onClick={UpdateIsPublic}
              >
                Set to {!isPublic ? "public" : "private"}
              </DropdownMenuCheckboxItem>
            </>
          }
          {files.length !== 0 &&
            <DropdownMenuCheckboxItem
              onClick={DownloadAll}
            >
              Download All
            </DropdownMenuCheckboxItem>
          }
          {content !== "" &&
            <DropdownMenuCheckboxItem>
              <Link
                href="/case"
                onClick={SaveNoteContent}
              >
                Convert content
              </Link>
            </DropdownMenuCheckboxItem>
          }
          {isLoggedIn &&
            <DropdownMenuCheckboxItem
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
        categoryId={categoryId}
        setOpen={toggleDialog}
      />
    </Dialog>
  )
}
