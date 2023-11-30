import TextareaField from '@/components/case/TextareaField'
import Heading from '@/components/notes/Heading'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: GenericTitle("Convert Case")
}

export default async function Home() {

  return (
    <>
      <Heading title="Convert Case" />
      <TextareaField />
    </>
  )
}
