import React, { useEffect } from 'react'
import { useAuth } from '../../services/auth/Auth'
import { useRouter } from 'next/router'
import { SignIn } from '../../admin/signIn/SingIn'
import s from './signIn.module.scss'

function AdminHome() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.isSignedIn) {
      router.replace(`/admin/articles`)
    }
  }, [auth])

  return (
    <main className={s.container}>
      <SignIn />
    </main>
  )
}

export default AdminHome
