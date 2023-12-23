"use client"
import Heading from '@/components/Heading'
import { AuthExpecter, useUser } from '@/components/common'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { availableTabs } from '@/lib/config'
import dynamic from 'next/dynamic'

const NotesWrapper = dynamic(() => import('@/components/notes/NotesWrapper'))
const NewNoteModal = dynamic(() => import('@/components/notes/NewNoteModal'))

const NoteTabs = () => {
  const { isLoggedIn } = useUser()
  const tabs = availableTabs(isLoggedIn)

  return (
    <AuthExpecter>
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
    </AuthExpecter>
  )
}

export default NoteTabs