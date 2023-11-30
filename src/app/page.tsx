import Heading from '@/components/notes/Heading'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: GenericTitle("Home")
}

export default async function Home() {

  return (
    <>
      <Heading title="Home" />
    </>
  )
}
