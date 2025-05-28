"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useCategoriesContext } from "@/context/CategoriesContext"
import { useUser } from "@/context/UserContext"
import { AppConfig } from "@/lib/config"
import { AddNote } from "@/lib/db"
import { customToast } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { } from "@radix-ui/react-select"
import { Cog, Loader2, Plus } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"
import Dropzone from "./Dropzone"
import CategorySettings from "./categories/CategorySettings"
import KeyIcon from "./categories/KeyIcon"
import { useCtrlSomething } from "@/hooks/hooks"

const FormSchema = z.object({
  content: z.string(),
  category: z.string(),
})

export default function NewNoteModal() {
  const searchParams = useSearchParams()
  const { Categories } = useCategoriesContext()
  const [Files, setFiles] = useState<File[]>([])
  const [Saving, setSaving] = useState<boolean>(false)
  const [Open, setOpen] = useState(false)
  const { isLoggedIn } = useUser()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
      category: "",
    },
  })

  const SaveNote = async ({ content, category }: z.infer<typeof FormSchema>) => {
    if (content === "" && Files.length === 0) {
      toast(customToast("Empty note.", true))
      return
    }

    setSaving(true)
    await AddNote(content, Files, isLoggedIn, category)

    setOpen(false)
    toast(customToast("Note was saved."))
    form.reset()
    setFiles([])
    setSaving(false)
  }

  useEffect(() => {
    if (searchParams.size === 0) return
    const cat = searchParams.get("category") ?? ""
    const isUnsetCat = [AppConfig.defaultFilters(true), AppConfig.defaultFilters(true, true)].includes(cat)
    const catId = !isUnsetCat ? Categories.find(category => category.content.toLowerCase() === cat)?.id ?? "" : ""
    form.setValue("category", isUnsetCat ? "" : catId)
  }, [searchParams, Categories])

  useCtrlSomething(() => SaveNote(form.getValues()), "enter")

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <div className="flex gap-3">
        {isLoggedIn &&
          <CategorySettings>
            <Button
              variant="outline"
              size="icon"
              title="Category Settings"
            >
              <Cog size={20} />
            </Button>
          </CategorySettings>
        }
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
          <DialogDescription className="sr-only">
            New note
          </DialogDescription>
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
              {isLoggedIn &&
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Categories.map(category => (
                            <SelectItem value={category.id} key={category.id}>
                              <div className="flex gap-3 items-center capitalize">
                                <KeyIcon
                                  name={category.icon}
                                  color={category.icon}
                                />
                                <span>{category.content}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              }
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
