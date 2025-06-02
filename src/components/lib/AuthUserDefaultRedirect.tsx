"use client"
import { useUser } from "@/context/UserContext"
import { ChildrenReceptor } from "@/types/common"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthUserDefaultRedirect({ children }: ChildrenReceptor) {
  const { isLoggedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    isLoggedIn && router.replace("/notes")
  }, [isLoggedIn])

  return children
}