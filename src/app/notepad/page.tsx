import Heading from '@/components/Heading'
import { AuthExpecter } from '@/components/lib/lib'
import OptionsButton from '@/components/notepad/OptionsButton'
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
          rightTitleSide={<OptionsButton />}
        />
        <TextareaNotepad delay={AppConfig.notepadAutoSaveDelay * 1000} />
        <History />
      </NotepadContext>
    </AuthExpecter>
  )
}
