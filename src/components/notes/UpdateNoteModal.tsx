"use client"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import Dropzone from "./Dropzone";
import { useEffect, useState } from "react";
import { GetFileName, UpdateCompleteNote } from "@/lib/db";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "../ui/use-toast";
import { customToast } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

const FormSchema = z.object({
  content: z.string().default(""),
})

type UpdateNoteModalProps = {
  id: string,
  content: string,
  files: string[]
  setOpen: (v: boolean) => void
}

export default function UpdateNoteModal({ content, files: prevFiles, id, setOpen }: UpdateNoteModalProps) {
  const [Files, setFiles] = useState<File[]>([])
  const [RemovedFiles, setRemovedFiles] = useState<string[]>([])
  const [Saving, setSaving] = useState<boolean>(false)
  const { isLoggedIn } = useUser()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content,
    },
  })

  const SaveNote = async ({ content }: z.infer<typeof FormSchema>) => {
    if (content === "" && Files.length === 0 && RemovedFiles.length === 0) {
      toast(customToast("Nothing to update.", true))
      return
    }

    setSaving(true)
    UpdateCompleteNote(id, content, RemovedFiles, prevFiles, Files, isLoggedIn)
    toast(customToast("Note was updated."))
    setOpen(false)
    form.reset()
    setFiles([])
    setRemovedFiles([])
    setSaving(false)
  }

  const ToggleRemoveExistingFile = (url: string) => {
    if (RemovedFiles.includes(url)) {
      const newRemovedFiles = RemovedFiles.filter(file => file !== url)
      setRemovedFiles(newRemovedFiles)
    } else {
      setRemovedFiles(files => [
        ...files,
        url
      ])
    }
  }

  useEffect(() => {
    if (form.getValues("content") === content) return
    form.setValue("content", content)
  }, [content])

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Update note</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(SaveNote)} className="flex items-center space-x-2">
          <div className="grid w-full gap-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Your note..."
                      className="min-h-16 h-52 max-h-96"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={(e) => e.target.selectionStart = content.length}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div>
              <Dropzone
                Files={Files}
                setFiles={setFiles}
              />
              {prevFiles.length !== 0 &&
                <div className={Files.length === 0 ? "pt-3" : ""}>
                  <ExistingFilesList
                    files={prevFiles}
                    onFileClick={ToggleRemoveExistingFile}
                    RemovedFiles={RemovedFiles}
                  />
                </div>
              }
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={Saving}
            >
              {Saving &&
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              }
              Save note
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent >
  )
}

type ExistingFilesListProps = {
  files: string[]
  RemovedFiles: string[]
  onFileClick: (v: string) => void
}

const ExistingFilesList = ({ files, onFileClick, RemovedFiles }: ExistingFilesListProps) => (
  <div className='flex flex-col gap-1'>
    {files.map(file =>
      <Button
        type="button"
        variant="ghost"
        className={`flex flex-row justify-start items-center gap-2 ${RemovedFiles.includes(file) ? "opacity-40" : ""}`}
        key={file}
        onClick={() => onFileClick(file)}
        title={GetFileName(file)}
      >
        <span className="text-destructive min-w-[1.125rem]">
          <Trash size={18} />
        </span>
        <span className='text-xs text-start word-break line-clamp-1'>
          {GetFileName(file)}
        </span>
      </Button>
    )}
  </div>
)
