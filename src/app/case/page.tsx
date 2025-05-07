import Heading from '@/components/Heading'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'
import TabsSection from '@/components/case/TabsSection'
import { TextareaFieldProvider } from '@/context/TextareaContext'

export const metadata: Metadata = {
  title: GenericTitle("Convert Case")
}

export default async function Home() {

  return (
    <>
      <Heading title="Convert Case" />
      <TextareaFieldProvider>
        <TabsSection />
      </TextareaFieldProvider>
    </>
  )
}
