import { useAuth } from '../services/auth/Auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useAuthGuard() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.isSignedIn) {
      router.replace(`/`)
    }
  }, [auth.isSignedIn])

  return auth.isSignedIn
}
