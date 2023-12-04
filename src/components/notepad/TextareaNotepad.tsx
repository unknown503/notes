"use client"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GetNotepadContent, UpdateNotepad } from '@/lib/db'
import { ChangeEvent, useEffect, useState } from 'react'
import TimeAgo from 'react-timeago'

const DELAY = 4000

export default function TextareaField() {
  const [Notepad, setNotepad] = useState<NotepadDoc | null>(null)
  const [Saving, setSaving] = useState(false)

  useEffect(() => {
    GetNotepadContent().then(res => setNotepad(res))
  }, [])

  useEffect(() => {
    if (!Notepad || !Saving) return
    let timeoutId: NodeJS.Timeout

    const delayedCallback = async () => {
      await UpdateNotepad(Notepad.content)
      setSaving(false)
    }

    timeoutId = setTimeout(delayedCallback, DELAY)
    return () => clearTimeout(timeoutId)
  }, [Notepad, Saving])

  const TextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotepad({
      content: e.currentTarget.value,
      timestamp: Date.now()
    })
    setSaving(true)
  }

  return (
    <div className="container py-4 lg:py-6 flex flex-col gap-4">
      <Label
        htmlFor="content"
      >
        Notepad content
      </Label>
      <Textarea
        placeholder="Type or paste something"
        className="min-h-[18rem] h-40 max-h-60"
        id='content'
        onChange={TextareaChange}
        value={Notepad?.content}
      />
      <div className="flex justify-between text-sm">
        <span>
          Character Count: {Notepad?.content.length}
        </span>
        <span>
          {Saving ?
            "Saving..."
            :
            Notepad ?
              <TimeAgo date={Notepad.timestamp} />
              :
              "Loading..."
          }
        </span>
      </div>
    </div>
  )
}
