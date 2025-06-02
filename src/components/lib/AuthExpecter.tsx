"use client"
import { useUser } from "@/context/UserContext"
import { ChildrenReceptor } from "@/types/common"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthExpecter({ children }: ChildrenReceptor) {
  const { user, isLoggedIn } = useUser()
  const showSpinner = (user === false || user === null) && !isLoggedIn
  const router = useRouter()

  useEffect(() => {
    !isLoggedIn && user === null && router.replace("/")
  }, [isLoggedIn, user])

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