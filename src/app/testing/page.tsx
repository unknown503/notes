"use client"
import { useEffect, useState } from "react"

export default function page() {
  const [Image, setImage] = useState("")

  useEffect(() => {
    fetch("/api/screenshot")
      .then(r => r.json())
      .then(r => {
        console.log(r)
        setImage(r.screenshotBuffer)
      })
  }, [])

  return (
    <div>
      {Image !== "" &&
        <img src={`data:image/png;base64,${Image}`} alt="" />
      }
    </div>
  )
}
