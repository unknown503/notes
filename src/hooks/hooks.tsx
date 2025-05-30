"use client"
import { useEffect } from "react"

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

export const useCtrlSomething = (callback: () => void, something = "s", condition?: boolean, skipCtrl = false) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const shouldTrigger = skipCtrl ? key === something : e.ctrlKey && key === something;
      if (!shouldTrigger || !condition) return;
      e.preventDefault()
      callback()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [callback])
}
