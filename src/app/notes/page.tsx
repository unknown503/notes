import { AuthCheckWrapper } from '@/components/common'
import Heading from '@/components/notes/Heading'
import { NewNoteModal } from '@/components/notes/NewNoteModal'
import NotesWrapper from '@/components/notes/NotesWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GenericTitle, availableTabs } from '@/lib/config'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: GenericTitle("Notes")
}

export default async function Home() {
  const { tabs } = availableTabs()

  return (
    <AuthCheckWrapper onlyAuth>
      <Tabs defaultValue={tabs[0]}>
        <Heading title="Notes" rightTitleSide={<NewNoteModal />}>
          <TabsList>
            {tabs.map(tab =>
              <TabsTrigger
                value={tab}
                key={tab}
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
            >
              <NotesWrapper
                filter={tab}
              />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </AuthCheckWrapper>
  )
}
