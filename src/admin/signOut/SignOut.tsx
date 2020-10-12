import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../services/auth/Auth'
import s from './SignOut.module.scss'
import { classnames } from '../../services/importHelpers'

export function SignOut() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const auth = useAuth()

  return (
    <button
      className={classnames('a', s.signOutButton)}
      onClick={async () => {
        setLoading(true)
        await auth.signOut()
        router.push('/')
      }}
      disabled={loading}
    >
      Sign out
    </button>
  )
}
