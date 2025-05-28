"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { CategoriesContextProps } from "@/context/CategoriesContext"
import { useIconsContext } from "@/context/IconsContext"
import { customToast } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import KeyIcon from "./KeyIcon"

const formSchema = z.object({
  icon: z.string().min(1, {
    message: "Icon?"
  }),
  category: z.string().min(2, {
    message: "Invalid category name"
  })
})

export default function CategoryForm({ setCategories }: Pick<CategoriesContextProps, "setCategories">) {
  const { Icons } = useIconsContext()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: "",
      category: ""
    },
  })

  const onSubmit = async ({ icon, category }: z.infer<typeof formSchema>) => {
    const newCategory = {
      id: Date.now().toString(),
      icon,
      content: category
    }
    setCategories(prev => [...prev, newCategory])
    toast(customToast("Category added."))
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex gap-2 pt-3 pr-2">
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="min-w-[4.8rem]">
                    <SelectValue placeholder="Icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Icons.map(icon => (
                    <SelectItem value={icon.name} key={icon.name}>
                      <KeyIcon name={icon.name} color={icon.color} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <Input
                type="text"
                placeholder="Something"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className="px-2"
        >
          <Plus />
        </Button>
      </form>
    </Form>
  )
}