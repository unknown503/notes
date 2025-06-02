import { customToast } from '@/lib/utils'
import { CopyButtonProps } from '@/types/common'
import { Slot } from '@radix-ui/react-slot'
import React from 'react'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

export default function CopyButton({ textToCopy, children, kind, onClick, disableToast, ...props }: CopyButtonProps) {
  const { toast } = useToast()

  const CopyToClipboard = () => {
    if (textToCopy === "") return
    navigator.clipboard.writeText(textToCopy?.trim() ?? "")
    !disableToast && toast(customToast("Content copied."))
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
