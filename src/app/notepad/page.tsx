import Heading from '@/components/Heading'
import AuthExpecter from '@/components/lib/AuthExpecter'
import OptionsNav from '@/components/notepad/OptionsNav'
import HistoryProvider from '@/context/HistoryContext'
import NotepadContext from '@/context/NotepadContext'
import { AppConfig, GenericTitle } from '@/lib/config'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: GenericTitle("Notepad")
}

const TextareaNotepad = dynamic(() => import('@/components/notepad/TextareaNotepad'))
const History = dynamic(() => import('@/components/notepad/History'))

export default function Home() {

  return (
    <AuthExpecter>
      <NotepadContext>
        <Heading
          title="Notepad"
          right={<OptionsNav />}
        />
        <HistoryProvider>
          <TextareaNotepad delay={AppConfig.notepadAutoSaveDelay * 1000} />
          <History />
        </HistoryProvider>
      </NotepadContext>
    </AuthExpecter>
  )
}
