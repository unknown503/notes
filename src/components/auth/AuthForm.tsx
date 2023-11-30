"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInUser } from "@/lib/db"
import { customToast } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "../ui/use-toast"

const formSchema = z.object({
  email: z.string().email("Invalid email.").min(10, {
    message: "Invalid password."
  }),
  password: z.string().min(9, {
    message: "Invalid password."
  })
})

export default function AuthForm() {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "auth@test.com",
      password: "123123123"
    },
  })

  const onSubmit = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      await SignInUser(email, password)
      toast(customToast("Auth successful."))
      router.push("/notes")

    } catch (error: any) {
      const errorCode = error.code;
      console.error(errorCode)

      if (errorCode === "auth/invalid-login-credentials") {
        toast(customToast("Invalid credentials.", true))
      } else {
        toast(customToast("Error.", true))
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="mail@thing.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="123"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="default"
          className="w-full"
        >
          Sign-in
        </Button>
      </form>
    </Form>
  )
}
