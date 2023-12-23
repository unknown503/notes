import Heading from '@/components/Heading'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'
import { TextareaFieldProvider } from '@/components/case/TextareaField'
import TabsSection from '@/components/case/TabsSection'

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
