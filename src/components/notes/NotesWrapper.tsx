"use client"
import { AddNote, SubscribeToNotes } from '@/lib/db'
import { GetCachedNotes, GetCachedNotesCount, ReplaceCachedNotes, prefix } from '@/lib/utils'
import { NoteDoc } from '@/types/notes'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useIsOffline, useUser } from '../common'
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
  const isOffline = useIsOffline()
  const { isLoggedIn } = useUser()

  useEffect(() => {
    const unsubscribe = SubscribeToNotes(docs => {
      setNotes(docs)

      if (GetCachedNotesCount() !== docs.length) {
        ReplaceCachedNotes(docs.map(doc => ({
          ...doc,
          files: []
        })))
      }

    }, visibilityFilter(filter))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (isOffline) return
    console.log("Local check")

    const notes = GetCachedNotes() as NoteDoc[]

    notes.map(note => {
      const { content, offlineSaving, id } = note
      if (!offlineSaving) return
      console.log("Saving note")
      AddNote(content, [], isLoggedIn, isOffline)
      localStorage.removeItem(`${prefix}-${id}`)
    })
  }, [isOffline])

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