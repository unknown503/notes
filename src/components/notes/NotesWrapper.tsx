"use client"
import { SubscribeToNotes } from '@/lib/db'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useNotesContext } from './NoteTabs'
import NotesSkeleton from './NotesSkeleton'

export type NotesWrapperProps = {
  filter: string,
}

const visibilityFilter = (filter: string) => filter === "all" ? undefined : filter === "public"

const NoteCard = dynamic(() => import('@/components/notes/NoteCard'), {
  loading: () => <NotesSkeleton count={1} />
})

export default function NotesWrapper({ filter }: NotesWrapperProps) {
  const { Notes, setNotes } = useNotesContext()

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
            <span className='font-bold text-lg'>
              No notes here...
            </span>
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