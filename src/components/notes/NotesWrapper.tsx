"use client"
import { GetCategories, GetIcons, SubscribeToNotes } from '@/lib/db'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import NotesSkeleton from './NotesSkeleton'
import { useNotesContext } from '@/context/NotesContext'
import { useCategoriesContext } from '@/context/CategoriesContext'
import { useSearchParams } from 'next/navigation'
import { useIconsContext } from '@/context/IconsContext'

type NotesWrapperProps = {
  filter: string
}

const visibilityFilter = (filter: string) => filter === "all" ? undefined : filter === "public"
const NoteCard = dynamic(() => import('@/components/notes/NoteCard'), {
  loading: () => <NotesSkeleton count={1} />
})

export default function NotesWrapper({ filter }: NotesWrapperProps) {
  const { Categories, setCategories } = useCategoriesContext()
  const { Notes, setNotes } = useNotesContext()
  const { setIcons } = useIconsContext()
  const searchParams = useSearchParams()

  useEffect(() => {
    GetCategories().then(res => setCategories(res.categories))
    GetIcons().then(res => setIcons(res.icons))
  }, [])

  useEffect(() => {
    if (Categories.length === 0) return
    const categoriesMap = new Map(
      Categories.map((category, index) => [category.id, index])
    )

    const filterParam = searchParams.get("category") ?? ""
    const filterId = Categories.find(cat => cat.content.toLowerCase() === filterParam)?.id

    const unsubscribe = SubscribeToNotes(setNotes, categoriesMap, filterId ?? filterParam, visibilityFilter(filter))
    return () => unsubscribe()
  }, [Categories, searchParams])

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