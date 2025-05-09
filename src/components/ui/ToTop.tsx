"use client"
import { ArrowUp } from "lucide-react"
import React, { useState, useEffect } from "react"
import { Button } from "./button"

const ToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <Button variant="default"
      onClick={scrollToTop}
      className={`fixed !size-12 bottom-2 md:bottom-8 right-2 md:right-8 p-3 rounded-full shadow-lg transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      aria-label="Scroll to top"
    >
      <ArrowUp color="white" />
    </Button>
  )
}

export default ToTop
