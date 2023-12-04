import Heading from '@/components/notes/Heading'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: GenericTitle("Notepad")
}

const TextareaNotepad = dynamic(() => import('@/components/notepad/TextareaNotepad'))

export default async function Home() {

  return (
    <>
      <Heading title="Notepad" />
      <TextareaNotepad />
    </>
  )
}
