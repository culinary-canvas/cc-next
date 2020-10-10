import { useAuth } from '../services/auth/Auth'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

export function useAuthGuard() {
  const auth = useAuth()
  const router = useRouter()

  let timeout = useRef<any>()

  useEffect(() => {
    if (auth.isSignedIn) {
      clearTimeout(timeout.current)
    } else {
      timeout.current = setTimeout(() => router.replace(`/`), 3000)
    }
  }, [auth.isSignedIn])

  return auth.isSignedIn
}
