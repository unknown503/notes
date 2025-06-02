"use client"
import Heading from '@/components/Heading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NotesProvider from '@/context/NotesContext'
import { useUser } from '@/context/UserContext'
import { availableTabs } from '@/lib/config'
import dynamic from 'next/dynamic'
import CategoriesProvider from '@/context/CategoriesContext'
import CategoryFilters from './categories/CategoryFilters'

const NotesWrapper = dynamic(() => import('@/components/notes/NotesWrapper'))
const NewNoteModal = dynamic(() => import('@/components/notes/NewNoteModal'))

const NoteTabs = () => {
  const { isLoggedIn, user } = useUser()
  const tabs = availableTabs(isLoggedIn)

  return (
    <NotesProvider>
      {user !== false &&
        <Tabs defaultValue={tabs[0]}>
          <CategoriesProvider>
            <Heading title="Notes" right={<NewNoteModal />}>
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
              {isLoggedIn && <CategoryFilters />}
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
          </CategoriesProvider>
        </Tabs>
      }
    </NotesProvider>
  )
}

export default NoteTabs