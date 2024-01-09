import Heading from '@/components/Heading'
import ManualSave from '@/components/notepad/ManualSave'
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

export default async function Home() {

  return (
    <NotepadContext>
      <Heading
        title="Notepad"
        rightTitleSide={<ManualSave />}
      />
      <TextareaNotepad delay={DELAY} />
      <History />
    </NotepadContext>
  )
}
