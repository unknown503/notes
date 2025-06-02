import Heading from '@/components/Heading'
import AuthUserDefaultRedirect from '@/components/lib/AuthUserDefaultRedirect'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: GenericTitle("Home")
}

const Home = () => (
  <AuthUserDefaultRedirect>
    <Heading title="Home" />
  </AuthUserDefaultRedirect>
)

export default Home