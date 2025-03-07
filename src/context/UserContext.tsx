"use client"
import { auth } from "@/lib/firebase"
import { UserType, ChildrenReceptor } from "@/types/common"
import { onAuthStateChanged } from "firebase/auth"
import { useContext, useState, useEffect, createContext } from "react"

const initial: UserType = {
  user: false,
  isLoggedIn: false
}

const UserContext = createContext<UserType>(initial)
export const useUser = () => useContext(UserContext)

export function UserProvider({ children }: ChildrenReceptor) {
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