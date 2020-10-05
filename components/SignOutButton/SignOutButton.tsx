import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../services/auth/Auth'

export function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const auth = useAuth()

  return (
    <button
      className="sign-out-button a"
      onClick={async () => {
        setLoading(true)
        await auth.signOut()
        // TODO nav
        //            router.navigate({ url: '/' })
      }}
      disabled={loading}
    >
      Sign out
    </button>
  )
}
