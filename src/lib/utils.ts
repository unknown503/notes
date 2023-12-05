import { ToasterToast } from "@/components/ui/use-toast"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const customToast = (description: string, isError = false, customTitle?: string): Omit<ToasterToast, "id"> => ({
  title: customTitle ?? isError ? "Error!" : "Done!",
  description,
  variant: isError ? "destructive" : "default"
})

export function getDate(unix: number, showTime = false) {
  const date = new Date(unix)

  const time: Intl.DateTimeFormatOptions = showTime ? {
    hour: '2-digit',
    minute: '2-digit',
  } : {}

  const fullDate = date.toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...time
  })

  return fullDate.replace(",", " ·")
}

export function convertToRichtext(content: string | null) {
  const urlRegex = /(?:https?|ftp):\/\/[^\s]+/g
  return content?.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`) ?? ""
}

export function IsAnImage(url: string) {
  var exts = /\.(jpg|jpeg|png|gif|bmp|svg)$/i
  return exts.test(url)
}

export function CapitalizedCase(text: string) {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

export function SentenceCase(text: string) {
  return text.toLowerCase().replace(/(^\w|\.\s*\w)/g, (char) => char.toUpperCase())
}

export function WordCount(text: string) {
  const words = text.trim().split(/\s+/)
  return words.length
}

export function DecodeHtml(html: string | null) {
  return html?.replace(/</g, "&lt;").replace(/>/g, "&gt;") || ""
}

export function SaveOnLocalStorage(key: string, content: string) {
  try {
    localStorage.setItem(key, content)
    return true
  } catch (e) {
    const quotaError = e instanceof DOMException && e.name === "QuotaExceededError"
    return quotaError ?
      "Could not add item to local storage due to content size."
      : (e as Error).message
  }
}

export function LoadAndDeleteLocalStorage(key: string) {
  const data = localStorage.getItem(key)
  data && localStorage.removeItem(key)
  return data || ""
}