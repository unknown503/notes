"use client"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GetNotepadContent } from '@/lib/db'
import { ChangeEvent, useEffect } from 'react'
import TimeAgo from 'react-timeago'
import { useNotepadContext } from './NotepadContext'

export type DelayType = { delay: number }

export default function TextareaField({ delay }: DelayType) {
  const { Notepad, Saving, setNotepad, setSaving, delayedCallback } = useNotepadContext()

  useEffect(() => {
    GetNotepadContent().then(setNotepad)
  }, [])

  useEffect(() => {
    if (!Notepad || !Saving) return
    const timeoutId = setTimeout(delayedCallback, delay)
    return () => clearTimeout(timeoutId)
  }, [Notepad, Saving])

  const TextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const time = Date.now() + delay
    setNotepad({
      content: e.currentTarget.value,
      timestamp: time
    })
    setSaving(time)
  }

  return (
    <div className="container py-4 lg:py-6 flex flex-col gap-4">
      <Label htmlFor="content">
        Notepad content
      </Label>
      <Textarea
        placeholder="Type or paste something"
        className="min-h-[18rem] h-40 max-h-60"
        id='content'
        onChange={TextareaChange}
        value={Notepad?.content}
        disabled={!Saving && !Notepad}
      />
      <div className="flex justify-between text-sm">
        <span>
          Character Count: {Notepad?.content.length}
        </span>
        <span>
          {Saving ?
            <>Saving in <TimeAgo date={Saving} minPeriod={1} /></> :
            Notepad ? <TimeAgo date={Notepad.timestamp} minPeriod={1} /> : "Loading..."
          }
        </span>
      </div>
    </div>
  )
}
