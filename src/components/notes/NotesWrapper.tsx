"use client"
import NoteCard from '@/components/notes/NoteCard'
import { SubscribeToNotes } from '@/lib/db'
import { useEffect, useState } from 'react'
import NotesSkeleton from './NotesSkeleton'

type NotesWrapperProps = {
  filter: string,
}

const visibilityFilter = (filter: string) => filter === "all" ? undefined : filter === "public"

export default function NotesWrapper({ filter }: NotesWrapperProps) {
  const [Notes, setNotes] = useState<NoteDoc[] | null>(null)

  useEffect(() => {
    const unsubscribe = SubscribeToNotes(docs => {
      setNotes(docs)
    }, visibilityFilter(filter))
    return () => unsubscribe()
  }, [])

  return (
    <div className='grid md:grid-cols-2 xl:grid-cols-4 gap-4'>
      {!Notes ?
        <NotesSkeleton count={8} />
        :
        <>
          {Notes.length === 0 ?
            <h3>No notes here...</h3>
            : Notes.map(note =>
              <NoteCard
                key={note.id}
                {...note}
              />
            )}
        </>
      }
    </div>
  )
}
