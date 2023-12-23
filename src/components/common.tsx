"use client"
import { auth } from "@/lib/firebase"
import { customToast } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { User, onAuthStateChanged } from 'firebase/auth'
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ButtonHTMLAttributes, ReactNode, createContext, useContext, useEffect, useState } from "react"
import { Button, ButtonProps } from "./ui/button"
import { useToast } from "./ui/use-toast"

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

type UserType = {
  user: User | null | false,
  isLoggedIn: boolean
}

const initial: UserType = {
  user: false,
  isLoggedIn: false
}

const UserContext = createContext<UserType>(initial)
export function UserProvider({ children }: { children: ReactNode }) {
  const [User, setUser] = useState<UserType>(initial)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser({
      user,
      isLoggedIn: user !== null
    }))
    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={User}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext);
}

type AuthWrapperProps = { children: ReactNode, onlyAuth: boolean }

export function AuthCheckWrapper({ children, onlyAuth }: AuthWrapperProps) {
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

export function AuthExpecter({ children }: Omit<AuthWrapperProps, "onlyAuth">) {
  const { user, isLoggedIn } = useUser()

  const shouldShowSpinner = user === false && !isLoggedIn

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

export function AuthUserDefaultRedirect({ children }: Omit<AuthWrapperProps, "onlyAuth">) {
  const { isLoggedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    isLoggedIn && router.replace("/notes")
  }, [isLoggedIn])

  return children
}


export const useIsOffline = () => {
  const [Offline, setOffline] = useState(false)

  useEffect(() => {
    const handleConnection = () => setOffline(!window.navigator.onLine)

    window.addEventListener("offline", handleConnection)
    window.addEventListener("online", handleConnection)

    return () => {
      window.removeEventListener("offline", handleConnection)
      window.removeEventListener("online", handleConnection)
    }
  }, [])

  return Offline
}