"use client"
import PasskeyForm from '@/components/auth/PasskeyForm'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { customToast } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function Passkey() {
  const router = useRouter()

  const comparePasskey = async (passkey: string) => {
    const res = await fetch('/api/passkey', {
      method: 'POST',
      body: JSON.stringify({ passkey }),
    });

    const json = await res.json()

    if (!json.success) {
      toast(customToast("Invalid", true))
      return
    }
    router.push("/notes")
  }

  return (
    <div className="container py-4 lg:py-12">
      <Card className='w-full py-4 lg:py-6 lg:w-[500px] mx-auto border-none'>
        <CardContent>
          <PasskeyForm onSubmit={comparePasskey} />
        </CardContent>
      </Card>
    </div>
  )
}
