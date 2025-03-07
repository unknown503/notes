"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddNote } from "@/lib/db"
import { customToast } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Cog, Loader2, Plus, WifiOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"
import Dropzone from "./Dropzone"
import CategorySettings from "./categories/CategorySettings"
import { useUser } from "@/context/UserContext"

const FormSchema = z.object({
  content: z.string().default(""),
})

export default function NewNoteModal() {
  const [Files, setFiles] = useState<File[]>([])
  const [Saving, setSaving] = useState<boolean>(false)
  const [Open, setOpen] = useState(false)
  const { isLoggedIn } = useUser()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  })

  const SaveNote = async ({ content }: z.infer<typeof FormSchema>) => {
    if (content === "" && Files.length === 0) {
      toast(customToast("Empty note.", true))
      return
    }

    setSaving(true)
    await AddNote(content, Files, isLoggedIn)

    setOpen(false)
    toast(customToast("Note was saved."))
    form.reset()
    setFiles([])
    setSaving(false)
  }

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <div className="flex gap-3">
        <CategorySettings>
          <Button
            variant="outline"
            size="icon"
            title="Copy content"
          >
            <Cog size={20} />
          </Button>
        </CategorySettings>
        <DialogTrigger asChild>
          <Button variant="default" aria-label="Create note">
            <Plus size={20} className="mr-2" />
            Create note
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            New note
          </DialogTitle>
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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Dropzone
                Files={Files}
                setFiles={setFiles}
              />
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
      </DialogContent>
    </Dialog>
  )
}
