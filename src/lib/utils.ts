import { ToasterToast } from "@/components/ui/use-toast"
import { NoteDoc } from "@/types/notes"
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

export function IsImage(url: string) {
  var exts = /\.(jpg|jpeg|png|gif|bmp|svg)$/i
  return exts.test(url)
}

export function IsPDF(url: string) {
  var exts = /\.(pdf)$/i
  return exts.test(url)
}

export function CapitalizedCase(text: string) {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

export function SentenceCase(text: string) {
  return text.toLowerCase().replace(/(^\w|\.\s*\w)/g, (char) => char.toUpperCase())
}

export function WordCount(text: string) {
  if (text === "") return 0
  const words = text.trim().split(/\s+/)
  return words.length
}

export function LineCount(text: string) {
  if (text === "") return 0
  var lines = text.split('\n');
  return lines.length;
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

export const prefix = "cached-note"

export function GetCachedNotes() {
  const items = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      items.push(JSON.parse(localStorage.getItem(key) ?? ""))
    }
  }
  return items
}

const RemoveCachedNotes = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      localStorage.removeItem(key)
    }
  }
}

export function ReplaceCachedNotes(notes: NoteDoc[]) {
  RemoveCachedNotes()
  notes.map(note => {
    SaveOnLocalStorage(`${prefix}-${note.id}`, JSON.stringify(note))
  })
}

export const GetCachedNotesCount = () => {
  let count = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) count++
  }
  return count
}

export const SortOfflineNotes = (notes: NoteDoc[]) => (
  notes.sort((a, b) => {
    if (b.isCritical !== a.isCritical) return b.isCritical ? 1 : -1
    return b.timestamp - a.timestamp
  })
)

export const ViewPDF = async (file: string) => {
  const res = await fetch(file)
  const blob = await res.blob()
  const pdf = new Blob([blob], { type: "application/pdf" });
  const url = URL.createObjectURL(pdf);
  const openedWindow = window.open();
  if (openedWindow) openedWindow.location.href = url;
}
