import Heading from '@/components/Heading'
import AuthCheckWrapper from '@/components/lib/AuthCheckWrapper'
import Passkey from '@/components/passkey/Passkey'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: GenericTitle("Home")
}

const Home = () => (
  <AuthCheckWrapper onlyAuth={false}>
    <Heading title="Home" />
    <Passkey />
  </AuthCheckWrapper>
)

export default Home