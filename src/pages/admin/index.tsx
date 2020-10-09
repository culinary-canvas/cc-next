import React from 'react'
import { useAuth } from '../../services/auth/Auth'
import { useRouter } from 'next/router'
import { SignIn } from '../../components/SignIn/SingIn'
import { useAutorun } from '../../hooks/useAutorun'

function AdminHome() {
  const auth = useAuth()
  const router = useRouter()

  useAutorun(() => {
    if (auth.isSignedIn) {
      router.replace(`/admin/articles`)
    }
  }, [auth])

  return (
    <main className="container page">
      <SignIn />
    </main>
  )
}

export default AdminHome
