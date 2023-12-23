"use client"
import Heading from '@/components/Heading'
import { AuthExpecter, useUser } from '@/components/common'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { availableTabs } from '@/lib/config'
import { NoteDoc, ChildrenReceptor } from '@/types/notes'
import dynamic from 'next/dynamic'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

const NotesWrapper = dynamic(() => import('@/components/notes/NotesWrapper'))
const NewNoteModal = dynamic(() => import('@/components/notes/NewNoteModal'))

const NoteTabs = () => {
  const { isLoggedIn } = useUser()
  const tabs = availableTabs(isLoggedIn)

  return (
    <AuthExpecter>
      <NotesProvider>
        <Tabs defaultValue={tabs[0]}>
          <Heading title="Notes" rightTitleSide={<NewNoteModal />}>
            <TabsList isDefault>
              {tabs.map(tab =>
                <TabsTrigger
                  value={tab}
                  key={tab}
                  isDefault
                >
                  {tab}
                </TabsTrigger>
              )}
            </TabsList>
          </Heading>

          <div className="container py-4 lg:py-6">
            {tabs.map(tab =>
              <TabsContent
                value={tab}
                key={tab}
                isDefault
              >
                <NotesWrapper
                  filter={tab}
                />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </NotesProvider>
    </AuthExpecter>
  )
}

type NotesContextProps = {
  Notes: NoteDoc[] | null,
  setNotes: Dispatch<SetStateAction<NoteDoc[] | null>>
}

const NotesContext = createContext<NotesContextProps>({
  Notes: null,
  setNotes: () => { },
})

export function useNotesContext() {
  return useContext(NotesContext)
}

const NotesProvider = ({ children }: ChildrenReceptor) => {
  const [Notes, setNotes] = useState<NoteDoc[] | null>(null)

  return (
    <NotesContext.Provider value={{ Notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  )
}


export default NoteTabs