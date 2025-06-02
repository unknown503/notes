"use client"
import { useUser } from "@/context/UserContext"
import { AuthWrapperProps, ChildrenReceptor } from "@/types/common"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthCheckWrapper({ children, onlyAuth }: AuthWrapperProps & ChildrenReceptor) {
  const { user, isLoggedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (onlyAuth) {
      if (user === null && isLoggedIn === false)
        router.replace("/auth")
    } else {
      if (user !== null && isLoggedIn === true)
        router.replace("/")
    }
  }, [user, isLoggedIn])


  const showSpinner = (user === null || user === false) && !isLoggedIn && onlyAuth ? true :
    (user !== null || isLoggedIn) && !onlyAuth ? true : false

  return (
    <>
      {showSpinner ?
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