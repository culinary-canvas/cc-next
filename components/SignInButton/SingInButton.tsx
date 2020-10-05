import React from 'react'
import { Button } from '../Button/Button'
import {useRouter} from 'next/router'

export function SignInButton() {
  const router = useRouter()

  return (
    <Button
      onClick={async () => {
        // TODO nav
        //router.navigate({ url: '/sign-in' })
      }}
    >
      Sign in
    </Button>
  )
}
