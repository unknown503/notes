"use client"
import Heading from '@/components/Heading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NotesProvider from '@/context/NotesContext'
import { useUser } from '@/context/UserContext'
import { availableTabs } from '@/lib/config'
import dynamic from 'next/dynamic'
import { AuthExpecter } from '../lib/lib'

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

export default NoteTabs