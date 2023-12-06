import NoteTabs from '@/components/notes/NoteTabs'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: GenericTitle("Notes")
}

const Notes = () => <NoteTabs />
export default Notes