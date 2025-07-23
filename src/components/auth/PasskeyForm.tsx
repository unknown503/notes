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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { customToast } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "../ui/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  passkey: z.string().min(6, {
    message: "Invalid passkey."
  })
})

type Props = {
  onSubmit: (passkey: string) => Promise<void>
}

export default function PasskeyForm({ onSubmit }: Props) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passkey: ""
    },
  })

  const handleSubmit = async ({ passkey }: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(passkey)
      form.reset()

    } catch (error: any) {
      console.error(error)
      toast(customToast("Error.", true))
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-[240px] flex flex-col gap-4 items-center">
          <FormField
            control={form.control}
            name="passkey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passkey</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field} type="password" pattern={REGEXP_ONLY_DIGITS}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full gap-1" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Enter
          </Button>
        </form>
      </div>
    </Form >
  )
}
