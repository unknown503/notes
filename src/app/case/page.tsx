import Heading from '@/components/Heading'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: GenericTitle("Convert Case")
}

const TextareaField = dynamic(() => import('@/components/case/TextareaField'))

export default async function Home() {

  return (
    <>
      <Heading title="Convert Case" />
      <TextareaField />
    </>
  )
}
