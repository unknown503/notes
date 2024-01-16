import Heading from '@/components/Heading'
import CombinedButtons from '@/components/notepad/CombinedButtons'
import NotepadContext from '@/components/notepad/NotepadContext'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: GenericTitle("Notepad")
}

const TextareaNotepad = dynamic(() => import('@/components/notepad/TextareaNotepad'))
const History = dynamic(() => import('@/components/notepad/History'))
const DELAY = 25000

export default function Home() {

  return (
    <NotepadContext>
      <Heading
        title="Notepad"
        rightTitleSide={
          <CombinedButtons />
        }
      />
      <TextareaNotepad delay={DELAY} />
      <History />
    </NotepadContext>
  )
}
