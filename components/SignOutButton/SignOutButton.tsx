import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { authService } from '../../services/auth/Auth.service'

export function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  return (
    <button
      className="sign-out-button a"
      onClick={async () => {
        setLoading(true)
        await authService.signOut()
        // TODO nav
        //            router.navigate({ url: '/' })
      }}
      disabled={loading}
    >
      Sign out
    </button>
  )
}
