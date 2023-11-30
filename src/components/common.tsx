"use client"
import { customToast } from "@/lib/utils"
import { Button, ButtonProps } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { ButtonHTMLAttributes } from "react"
import { Slot } from "@radix-ui/react-slot"

type ButtonType = {
  kind: "button"
} & ButtonProps

type GenericType = {
  kind: "generic"
} & ButtonHTMLAttributes<HTMLButtonElement>

type CopyButtonProps = (GenericType | ButtonType) & {
  textToCopy: string
}

export function CopyButton({ textToCopy, children, kind, onClick, ...props }: CopyButtonProps) {
  const { toast } = useToast()

  const CopyToClipboard = () => {
    if (textToCopy === "") return
    navigator.clipboard.writeText(textToCopy)
    toast(customToast("Content copied."))
  }
  
  const Comp = kind === "button" ? Button : Slot

  return (
    <Comp
      onClick={(e) => {
        CopyToClipboard()
        onClick && onClick(e)
      }}
      {...props}
    >
      {children}
    </Comp>
  )
}
