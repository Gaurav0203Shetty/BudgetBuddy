import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const AuthButton: React.FC = () => {
  const { data: session } = useSession()

  return session ? (
    <Button variant="outline" onClick={() => signOut()}>
      Sign Out ({session.user?.name})
    </Button>
  ) : (
    <Button variant="outline" onClick={() => signIn()}>
      Sign In
    </Button>
  )
}

export default AuthButton
