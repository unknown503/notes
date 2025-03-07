"use client"
import { useEffect, useState } from "react"

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

export const usePreventExit = (shouldWarn: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldWarn)
        event.preventDefault()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [shouldWarn])
}

export const useCtrlS = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [callback])
}
