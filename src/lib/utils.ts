import { ToasterToast } from "@/components/ui/use-toast"
import { type ClassValue, clsx } from "clsx"
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

export function convertToRichtext(content: string) {
  const urlRegex = /(?:https?|ftp):\/\/[^\s]+/g
  return content.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`)
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
  const words = text.trim().split(/\s+/);
  return words.length;
}

// function unsecuredCopyToClipboard(text) {
//   const textArea = document.createElement("textarea");
//   textArea.value = text;
//   document.body.appendChild(textArea);
//   textArea.focus();
//   textArea.select();
//   try {
//     document.execCommand('copy');
//   } catch (err) {
//     console.error('Unable to copy to clipboard', err);
//   }
//   document.body.removeChild(textArea);
// }