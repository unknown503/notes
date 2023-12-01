import { AuthCheckWrapper } from '@/components/common'
import Heading from '@/components/notes/Heading'
import { Card, CardContent } from '@/components/ui/card'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: GenericTitle("Sign-in")
}

const AuthForm = dynamic(() => import('@/components/auth/AuthForm'))

export default async function Home() {
  return (
    <AuthCheckWrapper onlyAuth={false}>
      <Heading title="Sign-in" />
      <div className="container py-4 lg:py-8">
        <Card className='w-full py-4 lg:py-6 lg:w-[500px] mx-auto'>
          <CardContent>
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </AuthCheckWrapper>
  )
}
