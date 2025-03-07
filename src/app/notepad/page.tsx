import Heading from '@/components/Heading'
import OptionsButton from '@/components/notepad/OptionsButton'
import NotepadContext from '@/context/NotepadContext'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: GenericTitle("Notepad")
}

const TextareaNotepad = dynamic(() => import('@/components/notepad/TextareaNotepad'))
const History = dynamic(() => import('@/components/notepad/History'))
const DELAY = 25

export default function Home() {

  return (
    <NotepadContext>
      <Heading
        title="Notepad"
        rightTitleSide={<OptionsButton />}
      />
      <TextareaNotepad delay={DELAY * 1000} />
      <History />
    </NotepadContext>
  )
}
