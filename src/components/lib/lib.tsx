"use client"
import { customToast } from "@/lib/utils"
import { AuthWrapperProps, ChildrenReceptor, CopyButtonProps } from "@/types/common"
import { Slot } from "@radix-ui/react-slot"
import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"

export function CopyButton({ textToCopy, children, kind, onClick, ...props }: CopyButtonProps) {
  const { toast } = useToast()

  const CopyToClipboard = () => {
    if (textToCopy === "") return
    navigator.clipboard.writeText(textToCopy?.trim() ?? "")
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

export function AuthExpecter({ children }: ChildrenReceptor) {
  const { user, isLoggedIn } = useUser()

  const shouldShowSpinner = (user === false || user === null) && !isLoggedIn

  return (
    <>
      {shouldShowSpinner ?
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2
            className="h-12 w-12 animate-spin"
          />
        </div>
        :
        children
      }
    </>
  )
}

export function AuthCheckWrapper({ children, onlyAuth }: AuthWrapperProps & ChildrenReceptor) {
  const { user, isLoggedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (onlyAuth) {
      if (user === null && isLoggedIn === false) {
        router.replace("/auth")
      }
    } else {
      if (user !== null && isLoggedIn === true) {
        router.replace("/")
      }
    }
  }, [user, isLoggedIn, onlyAuth])


  const shouldShowSpinner = (user === null || user === false) && !isLoggedIn && onlyAuth ? true :
    (user !== null || isLoggedIn) && !onlyAuth ? true : false

  return (
    <>
      {shouldShowSpinner ?
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2
            className="h-12 w-12 animate-spin"
          />
        </div>
        :
        children
      }
    </>
  )
}

export function AuthUserDefaultRedirect({ children }: ChildrenReceptor) {
  const { isLoggedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    isLoggedIn && router.replace("/notes")
  }, [isLoggedIn])

  return children
}